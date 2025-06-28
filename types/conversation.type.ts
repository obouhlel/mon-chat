import type { User } from "./user.type";
import type { Message } from './message.type';

export interface Conversation {
  user: User,
  last_message: Message,
}