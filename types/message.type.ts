import type { User } from './user.type';

export interface MessageList {
  user: User,
  content: string,
  created_at: Date,
}

export interface Message {
  id: string,
  content: string,
  sender_id: string,
  sender?: User,
  created_at: string,
  converation_id: string,
}