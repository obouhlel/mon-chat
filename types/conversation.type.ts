import type { User } from "./user.type";
import type { Message } from './message.type';

export interface ConversationShort {
  id: string,
  user: User,
  last_message: Message,
}

export interface Conversation {
  id: string,
  user1Id: string,
  user2Id: string,
  user1: User,
  user2: User,
  messages: Message[]
  created_at: string,
}