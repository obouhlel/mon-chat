import { serverSupabaseClient } from '#supabase/server';
import { z } from 'zod';
import type { Database } from "~/types/supabase.type";

const messagesSchema = z.object({
  conversationId: z.string(),
  senderId: z.string(),
  message: z.string().min(1, "Le message ne peut pas être vide"),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = messagesSchema.parse(body);
    const supabase = await serverSupabaseClient<Database>(event);

    const { data, error } = await supabase.from('messages').insert({
      conversation_id: validatedData.conversationId,
      sender_id: validatedData.senderId,
      content: validatedData.message,
    }).select().single();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failled to send message'
      });
    }

    setResponseStatus(event, 201);
    return { success: true };
  } catch (error) {
    return error;
  }
})