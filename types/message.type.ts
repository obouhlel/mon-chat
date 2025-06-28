import type { User } from './user.type';

export interface MessageList {
  user: User,
  content: string,
  // date: Date,
}

export interface Message {
  id: string,
  content: string,
  sender_id: string,
  sender?: User,
  create_at: string,
  converation_id: string,
}