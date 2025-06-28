import type { User } from "./user.type";
import type { Message } from './message.type';

export interface Conversation {
  id: string,
  user: User,
  last_message: Message,
}