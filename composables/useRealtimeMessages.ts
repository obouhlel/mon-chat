import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Conversation } from '~/types/conversation.type';
import type { Message } from '~/types/message.type';
import type { User } from '~/types/user.type';
import type { Database } from '~/types/supabase.type';

export function useRealtimeMessages() {
  const authUser = useSupabaseUser();
  const supabase = useSupabaseClient<Database>();

  let messagesSubscription: RealtimeChannel | null = null;

  function subscribeToMessages(
    onNewMessage: (messageData: Message) => void,
    onConversationsUpdate: () => void
  ) {
    messagesSubscription = supabase
      .channel(`messages-realtime`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload: { new: Message }) => {
          if (!authUser.value) return;

          const newMessage = payload.new;
          const { conversation } = await $fetch<{ conversation: Conversation }>(`/api/conversations/${newMessage.conversation_id}`);

          // Check if the user is in conversation
          let user: User | null = null;

          if (authUser.value.id === conversation.user1.id) {
            user = conversation.user1;
          } else if (authUser.value.id === conversation.user2.id) {
            user = conversation.user2;
          }
          if (!user) return;

          const sender = newMessage.sender_id === conversation.user1.id ? conversation.user1 : conversation.user2;

          onNewMessage({
            conversationId: newMessage.conversation_id,
            messageData: {
              user: sender,
              content: newMessage.content,
              created_at: new Date(newMessage.created_at),
            }
          });

          onConversationsUpdate();
        }
      )
      .subscribe();
  }

  function unsubscribeFromMessages() {
    if (messagesSubscription) {
      supabase.removeChannel(messagesSubscription);
      messagesSubscription = null;
    }
  }

  return {
    subscribeToMessages,
    unsubscribeFromMessages
  }
}
