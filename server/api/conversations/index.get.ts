import getAuthUser from "~/server/utils/get-auth-user";
import { serverSupabaseClient } from '#supabase/server';
import type { Database } from "~/types/supabase.type";

export default defineEventHandler(async (event) => {
  try {
    const { id: userId } = await getAuthUser(event);
    const supabase = await serverSupabaseClient<Database>(event);

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        user1:user_profiles!user1_id(*),
        user2:user_profiles!user2_id(*),
        messages(*)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const conversations = data.map((conversation) => {
      const user = conversation.user1_id === userId ? conversation.user2 : conversation.user1;
      const lastMessage = conversation.messages[conversation.messages.length - 1];

      return {
        id: conversation.id,
        user: user,
        last_message: lastMessage || "",
      }
    });

    return {
      conversations,
    };
  } catch (error) {
    return error;
  }
})