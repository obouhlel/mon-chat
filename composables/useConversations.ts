import type { ConversationShort } from '~/types/conversation.type';

export function useConversations() {
  const toast = useToast();
  const conversations = ref<ConversationShort[]>([]);

  async function getConversations() {
    try {
      const data = await $fetch<{ conversations: ConversationShort[] }>('/api/conversations');
      conversations.value = data.conversations;
    } catch (error) {
      toast.add({ title: 'Erreur lors du chargement des conversations.', color: 'red' });
    }
  }

  async function createConversation(userId: string, message: string) {
    try {
      await $fetch('/api/conversations', {
        method: 'POST',
        body: {
          userId,
          message,
        }
      });
      await getConversations();
      toast.add({ title: 'Conversation créée avec succès.', color: 'green' });
      return true;
    } catch (error: any) {
      if (error?.statusCode === 409) {
        toast.add({ title: 'Une conversation existe déjà entre ces utilisateurs.', color: 'orange' });
      } else {
        toast.add({ title: 'Erreur lors de la création de la conversation.', color: 'red' });
      }
      return false;
    }
  }

  return {
    conversations,
    getConversations,
    createConversation
  }
}
