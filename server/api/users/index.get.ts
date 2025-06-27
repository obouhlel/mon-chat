import { serverSupabaseClient } from '#supabase/server';
import type { User } from '~/types/user.type';

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event);

    const { data, error } = await supabase.auth.admin.listUsers();

    if (error && !data) {
      throw error;
    }

    const user = await getAuthUser(event);
    const users: User[] = data.users.map((u) => ({
      id: u.id,
      email: u.email!,
      display_name: u.user_metadata.display_name,
    })).filter((u) => u.id !== user.id);

    return users;
  } catch (error) {
    return error;
  }
})