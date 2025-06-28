import type { User } from './user.type';

export interface Message {
  id: string,
  content: string,
  sender_id: string,
  sender?: User,
  create_at: string,
  converation_id: string,
}