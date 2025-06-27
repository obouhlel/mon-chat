import { serverSupabaseUser } from '#supabase/server';
import type { H3Event, EventHandlerRequest } from 'h3';
import type { User } from '~/types/users.type';

export default async function getAuthUser(event: H3Event<EventHandlerRequest>): Promise<User> {
  try {
    const data = await serverSupabaseUser(event)

    if (!data) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'You must be authenticated to access this resource.',
      })
    }

    const user: User = {
      id: data.id,
      email: data.email!,
      display_name: data.user_metadata.display_name
    }

    return user;
  } catch (error: any) {
    if (
      error.statusMessage === 'Auth session missing!' ||
      error.cause?.statusMessage === 'Auth session missing!' ||
      error.message?.includes('Auth session missing')
    ) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentication token is missing or invalid.',
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Server Error',
      message: error.message || 'An unknown error occurred during authentication.',
    })
  }
}
