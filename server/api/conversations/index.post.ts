import getAuthUser from "~/server/utils/get-auth-user";
import { serverSupabaseClient } from '#supabase/server';
import { z } from 'zod';
import type { Database } from "~/types/supabase.type";

const conversationSchema = z.object({
  userId: z.string(),
  message: z.string().min(1, "Le message ne peut pas être vide")
})

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuthUser(event);
    const body = await readBody(event);

    const validatedData = conversationSchema.parse(body);

    const supabase = await serverSupabaseClient<Database>(event);

    const { data: existingConversation, error: checkError } = await supabase
      .from('conversations')
      .select('*')
      .or(`
        and(user1_id.eq.${user.id},user2_id.eq.${validatedData.userId}),
        and(user1_id.eq.${validatedData.userId},user2_id.eq.${user.id})
      `)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to check existing conversation',
        data: checkError
      });
    }

    if (existingConversation) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Une conversation existe déjà entre ces utilisateurs'
      });
    }

    const { data, error } = await supabase.from('conversations').insert({
      user1_id: user.id,
      user2_id: validatedData.userId,
    }).select().single();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create conversation',
        data: error
      });
    }

    const res = await $fetch('/api/messages', {
      method: 'POST',
      body: {
        conversationId: data.id,
        senderId: user.id,
        message: validatedData.message,
      }
    });

    setResponseStatus(event, 201);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid data',
        data: error.errors,
      });
    }
    return error;
  }
})