import { serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/types/supabase.type';

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient<Database>(event);

    const { data, error } = await supabase.from('user_profiles').select('*');

    if (error && !data) {
      throw error;
    }

    const user = await getAuthUser(event);
    const users = data.filter((u) => u.id !== user.id);

    return users;
  } catch (error) {
    return error;
  }
})