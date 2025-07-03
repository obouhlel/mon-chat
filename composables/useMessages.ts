import type { Conversation } from '~/types/conversation.type';
import type { MessageList } from '~/types/message.type';

export function useMessages() {
  const toast = useToast();
  const authUser = useSupabaseUser();
  const messages = ref<MessageList[]>([]);
  const selectedConversationId = ref<string | null>(null);

  async function selectConversation(conversationId: string) {
    try {
      const data = await $fetch<{ conversation: Conversation }>(`/api/conversations/${conversationId}`);
      messages.value = data.conversation.messages.map((message) => ({
        user: message.sender_id === data.conversation.user1.id ? data.conversation.user1 : data.conversation.user2,
        content: message.content,
        created_at: new Date(message.created_at),
      }));
      selectedConversationId.value = data.conversation.id;
      return data.conversation;
    } catch (error) {
      toast.add({ title: 'Erreur lors du chargement de la conversation.', color: 'red' });
      return null;
    }
  }

  async function sendMessage(conversationId: string, message: string) {
    try {
      if (!conversationId || message.length === 0) {
        const errorMessage = message.length === 0 ? "Le message est vide" : "Aucune conversation est selectionnée";
        toast.add({ title: 'Erreur lors de l\'envoi du message.', description: errorMessage, color: 'red' });
        return false;
      }
      await $fetch('/api/messages', {
        method: 'POST',
        body: {
          conversationId,
          senderId: authUser.value!.id,
          message,
        }
      });
      return true;
    } catch (error) {
      toast.add({ title: 'Erreur lors de l\'envoi du message.', color: 'red' });
      return false;
    }
  }

  function addMessage(messageData: MessageList) {
    messages.value.push(messageData);
  }

  function clearMessages() {
    messages.value = [];
    selectedConversationId.value = null;
  }

  return {
    messages,
    selectedConversationId: readonly(selectedConversationId),
    selectConversation,
    sendMessage,
    addMessage,
    clearMessages
  }
}
