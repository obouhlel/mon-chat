<script setup lang="ts">
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Conversation, ConversationShort } from '~/types/conversation.type';
import type { MessageList } from '~/types/message.type';
import type { Database } from '~/types/supabase.type';
import type { User } from '~/types/user.type';

definePageMeta({
  middleware: ["guest"]
})

const toast = useToast();
const authUser = useSupabaseUser();
const supabase = useSupabaseClient<Database>();
let messagesSubscription: RealtimeChannel | null = null;

// Liste de conversations
const search = ref<string>('');
const conversations = ref<ConversationShort[]>([]);
const filtredConversation = computed<ConversationShort[]>(() => {
  if (search.value === '') {
    return conversations.value;
  }
  return conversations.value.filter((conversation: ConversationShort) => {
    return conversation.user.display_name.toLowerCase().startsWith(search.value.toLowerCase());
  });
})

// Conversation
const select = ref<string | null>(null);
const messages = ref<MessageList[]>([]);
const message = ref<string>('');
const messagesContainer = ref<HTMLElement | null>(null);

// Creation d'une nouvelle conversation
const modal = ref<boolean>(false);
const loading = ref<boolean>(false);
const newMessage = ref<string>('');
const users = ref<User[]>([]);
const userId = ref<string | null>(null);
const user = computed<User | null>(() => users.value.find((u: User) => u.id === userId.value) || null);

async function createConversation() {
  loading.value = true;
  try {
    if (!user.value) return;
    await $fetch('/api/conversations', {
      method: 'POST',
      body: {
        userId: user.value.id,
        message: newMessage.value,
      }
    });
    await getConversations();
    toast.add({ title: 'Conversation créée avec succès.', color: 'green' });
  } catch (error: any) {
    if (error?.statusCode === 409) {
      toast.add({ title: 'Une conversation existe déjà entre ces utilisateurs.', color: 'orange' });
    } else {
      toast.add({ title: 'Erreur lors de la création de la conversation.', color: 'red' });
    }
  } finally {
    loading.value = false;
    modal.value = false;
  }
}

async function getConversations() {
  try {
    const data = await $fetch<{conversations: ConversationShort[]}>('/api/conversations');
    conversations.value = data.conversations;
  } catch (error) {
    toast.add({ title: 'Erreur lors du chargement des conversations.', color: 'red' });
  }
}

async function fetchUsers() {
  try {
    const data = await $fetch<User[]>('/api/users');
    users.value = data;
    if (data.length > 0 && !userId.value) {
      userId.value = data[0].id;
    }
  } catch (error) {
    toast.add({ title: 'Erreur lors du chargement des utilisateurs.', color: 'red' });
  }
}

async function selectConversation(conversationId: string) {
  try {
    const data = await $fetch<{conversation: Conversation}>(`/api/conversations/${conversationId}`);
    messages.value = data.conversation.messages.map((message) => ({
      user: message.sender_id === data.conversation.user1.id ? data.conversation.user1 : data.conversation.user2,
      content: message.content,
      created_at: new Date(message.created_at),
    }));
    select.value = data.conversation.id;
    nextTick(() => {
      scrollToBottom();
    });
  } catch (error) {
    toast.add({ title: 'Erreur lors du chargement de la conversation.', color: 'red' });
  }
}

async function createNewMessage() {
  try {
    const conversationId = select.value;
    if (!conversationId || message.value.length === 0) {
      const errorMessage = message.value.length === 0 ? "Le message est vide" : "Aucune conversation est selectionnée";
      toast.add({ title: 'Erreur lors de l\'envoi du message.', description: errorMessage, color: 'red' });
      return;
    }
    await $fetch('/api/messages', {
      method: 'POST',
      body: {
        conversationId,
        senderId: authUser.value!.id,
        message: message.value,
      }
    });
    await getConversations();
    await selectConversation(conversationId);
    nextTick(() => {
      scrollToBottom();
    });
  } catch (error) {
    toast.add({ title: 'Erreur lors de l\'envoi du message.', color: 'red' });
  } finally {
    message.value = '';
  }
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

async function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    await createNewMessage();
  }
}

// Responsive
const isMobile = ref<boolean>(false);

function checkMobile() {
  isMobile.value = window.innerWidth < 1024;
}

function backToConversations() {
  select.value = null;
}

function getCurrentConversationName(): string {
  const conversation = conversations.value.find(c => c.id === select.value);
  return conversation ? conversation.user.display_name : '';
}

function getDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);

  messagesSubscription = supabase
    .channel(`messages-realtime`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      },
      async (payload) => {
        const newMessage = payload.new;

        if (newMessage.conversation_id === select.value) {
          const sender = users.value.find((u) => u.id === newMessage.sender_id);
          if (!sender) await fetchUsers();

          const user = users.value.find((u) => u.id === newMessage.sender_id);
          if (!user) return;

          messages.value.push({
            user,
            content: newMessage.content,
            created_at: new Date(newMessage.created_at),
          });

          nextTick(() => scrollToBottom());
        }
        await getConversations();
      }
    )
    .subscribe();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  if (messagesSubscription) {
    supabase.removeChannel(messagesSubscription);
  }
});

onBeforeMount(async () => {
  await getConversations();
  await fetchUsers();
})
</script>

<template>
  <div class="w-full min-h-[calc(100vh-56px-32px)] grid grid-cols-1 lg:grid-cols-5 gap-0 px-3">
    
    <!-- List de conversation -->
    <div class="w-full h-[calc(100vh-56px-32px)]" :class="{ 'hidden': select && isMobile }">
      <div class="w-full h-auto pr-3 mb-3 flex items-start justify-start">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Recherche..." class="w-full" />
      </div>
      
      <div class="w-full h-[calc(100vh-56px-32px-44px)] flex flex-col flex-nowrap border lg:border-r-0 border-emerald-800 dark:border-emerald-200 rounded px-2 py-3 space-y-2 overflow-y-auto">
        <UButton
          icon="i-heroicons:plus-20-solid"
          label="Nouvelle conversation"
          class="w-full flex items-center justify-center"
          @click="modal = true"
        />
        <div v-if="conversations.length === 0">
          <div class="w-full h-full flex items-center justify-center">
            <h1 class="font-bold text-xl">Pas de discussion commencée</h1>
          </div>
        </div>
        <div
          v-else
          v-for="conversation of filtredConversation"
          :key="conversation.id"
          class="w-full h-auto border-2 p-2 rounded bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900 hover:dark:bg-emerald-800 cursor-pointer flex justify-between items-center"
          @click="selectConversation(conversation.id)"
        >
          <div class="min-w-0 flex-1">
            <h1 class="font-bold text-lg lg:text-xl truncate">{{ conversation.user.display_name }} ({{ conversation.user.email }})</h1>
            <p class="w-full text-justify line-clamp-1 overflow-hidden text-sm lg:text-base">{{ conversation.last_message.content }}</p>
            <p class="w-full text-right text-gray-500 dark:text-gray-400">{{ getDate(conversation.last_message.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Conversation -->
    <div class="w-full h-[calc(100vh-56px-32px)] flex flex-col border border-emerald-800 dark:border-emerald-200 rounded lg:col-span-4" :class="{ 'hidden': !select && isMobile }">
      <div v-if="select" class="w-full p-3 border-b border-emerald-800 dark:border-emerald-200 flex items-center gap-3">
        <UButton
          v-if="isMobile"
          icon="i-heroicons:arrow-left-20-solid" 
          variant="ghost" 
          @click="backToConversations" 
        />
        <h2 class="font-bold text-lg truncate">{{ getCurrentConversationName() }}</h2>
      </div>
      
      <div
        v-if="select"
        ref="messagesContainer"
        class="w-full flex-1 px-3 py-4 flex flex-col gap-5 items-start justify-start overflow-y-auto"
      >
        <div
          v-for="message of messages"
          :key="message.user.id"
          class="w-full flex"
          :class="message.user.id === authUser?.id ? 'justify-end' : 'justify-start'"
        >
          <div
            class="w-full max-w-[85%] lg:w-[50%] flex items-start justify-start gap-1 border-2 border-emerald-800 dark:border-emerald-200 p-2 rounded"
            :class="message.user.id === authUser?.id ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-emerald-200 dark:bg-emerald-800'"
          >
            <div class="flex flex-col w-full">
              <div class="flex items-center justify-between">
              <h1 class="font-bold text-sm lg:text-base">{{ message.user.display_name }}</h1>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ message.created_at.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }}</span>
              </div>
              <p class="text-sm lg:text-base break-words">{{ message.content }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="w-full flex-1 flex items-center justify-center">
        <h1 class="font-bold text-xl">Pas de discussion selectionnée</h1>
      </div>
      <div class="w-full flex px-2 py-4 space-x-2 border-t border-emerald-800 dark:border-emerald-200">
        <UInput v-model="message" class="w-full" placeholder="Message..." :disabled="!select" @keydown="handleKeyPress" />
        <UButton icon="i-heroicons:paper-airplane-solid" label="Send" :disabled="message === '' && !select" @click="createNewMessage" />
      </div>
    </div>

    <!-- Creation d'une nouvelle conversation -->
    <UModal v-model="modal">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="w-full">
            <h1 class="text-center text-lg lg:text-xl font-bold">Création d'une nouvelle discussion</h1>
          </div>
        </template>

        <div class="w-full flex flex-col justify-start items-start space-y-3">
          <div class="w-full flex flex-col space-y-3">
            <h2 class="font-bold text-lg lg:text-xl">Utilisateur</h2>
            <USelect
              v-if="users.length > 0 && userId"
              v-model="userId"
              placeholder="Sélectionne un utilisateur"
              :options="users"
              option-attribute="display_name"
              value-attribute="id"
              class="w-full"
            />
            <USelect v-else
              placeholder="Aucun utilisateur n'est trouvé"
              class="w-full"
            />
          </div>
          <div class="w-full flex flex-col space-y-3">
            <h2 class="font-bold text-lg lg:text-xl">Message</h2>
            <UTextarea v-model="newMessage" class="w-full" placeholder="Message..." />
          </div>
          <UButton 
            icon="i-heroicons:paper-airplane-solid" 
            label="Send"
            class="w-full justify-center"
            :disabled="newMessage === ''"
            :loading="loading"
            @click="createConversation"
          />
        </div>
      </UCard>
    </UModal>
  </div>
</template>