import getAuthUser from "~/server/utils/get-auth-user";
import { serverSupabaseClient } from '#supabase/server';
import type { Database } from "~/types/supabase.type";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const supabase = await serverSupabaseClient<Database>(event);

    const { data, error } = await supabase.from('conversations')
      .select(`
        *,
        user1:user_profiles!user1_id(*),
        user2:user_profiles!user2_id(*),
        messages(*)
      `)
      .or(`id.eq.${id}`)
      .order('created_at', { ascending: true })
      .single();

    if (error) {
      throw error;
    }

    return {
      conversation: data,
    }
  } catch (error) {
    return error;
  }
})