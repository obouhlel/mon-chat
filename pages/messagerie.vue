<script setup lang="ts">
definePageMeta({
  middleware: ["guest"]
})

const authUser = useSupabaseUser();

// Composables
const { conversations, getConversations, createConversation } = useConversations();
const { messages, selectedConversationId, selectConversation, sendMessage, addMessage, clearMessages } = useMessages();
const { users, fetchUsers } = useUsers();
const { subscribeToMessages, unsubscribeFromMessages } = useRealtimeMessages();
const { isMobile } = useResponsive();

// UI State
const search = ref<string>('');
const message = ref<string>('');
const modal = ref<boolean>(false);
const loading = ref<boolean>(false);
const newMessageModal = ref<string>('');
const userId = ref<string | null>(null);

// Conversation ref HTML
const conversationRef = ref<any>(null);

// Computed
const isConversationListVisible = computed(() => !selectedConversationId.value || !isMobile.value);
const isConversationVisible = computed(() => !!selectedConversationId.value || !isMobile.value);

const currentConversationName = computed(() => {
  const conversation = conversations.value.find(c => c.id === selectedConversationId.value);
  return conversation ? conversation.user.display_name : '';
});

// Methods
async function handleSelectConversation(conversationId: string) {
  await selectConversation(conversationId);
  nextTick(() => {
    conversationRef.value?.scrollToBottom();
  });
}

async function handleSendMessage() {
  if (!selectedConversationId.value) return;
  
  const success = await sendMessage(selectedConversationId.value, message.value);
  if (success) {
    await getConversations();
    await selectConversation(selectedConversationId.value);
    message.value = '';
    nextTick(() => {
      conversationRef.value?.scrollToBottom();
    });
  }
}

async function handleCreateConversation() {
  if (!userId.value) return;
  
  loading.value = true;
  const success = await createConversation(userId.value, newMessageModal.value);
  if (success) {
    modal.value = false;
    newMessageModal.value = '';
  }
  loading.value = false;
}

function handleBackToConversations() {
  clearMessages();
}

// Realtime setup of supabase on insert new message
function setupRealtime() {
  subscribeToMessages(
    ({ conversationId, messageData }) => {
      if (conversationId === selectedConversationId.value) {
        addMessage(messageData);
        nextTick(() => conversationRef.value?.scrollToBottom());
      }
    },
    () => getConversations()
  );
}

// Event
onBeforeMount(async () => {
  await getConversations();
  const fetchedUsers = await fetchUsers();
  if (fetchedUsers.length > 0 && !userId.value) {
    userId.value = fetchedUsers[0].id;
  }
});

onMounted(() => {
  setupRealtime();
});

onUnmounted(() => {
  unsubscribeFromMessages();
});
</script>

<template>
  <div class="w-full min-h-[calc(100vh-56px-32px)] grid grid-cols-1 lg:grid-cols-5 gap-0 px-3">
    
    <!-- List de conversation -->
    <MessagerieConversationList
      :conversations="conversations"
      :search="search"
      :is-visible="isConversationListVisible"
      @update:search="search = $event"
      @select-conversation="handleSelectConversation"
      @create-conversation="modal = true"
    />

    <!-- Conversation -->
    <MessagerieConversation
      ref="conversationRef"
      :messages="messages"
      :current-user-id="authUser?.id"
      :conversation-name="currentConversationName"
      :is-visible="isConversationVisible"
      :is-mobile="isMobile"
      :message="message"
      :is-conversation-selected="!!selectedConversationId"
      @back-to-conversations="handleBackToConversations"
      @update:message="message = $event"
      @send-message="handleSendMessage"
    />

    <!-- Creation d'une nouvelle conversation -->
    <MessagerieCreateConversationModal
      v-model:is-open="modal"
      v-model:selected-user-id="userId"
      v-model:new-message="newMessageModal"
      :users="users"
      :loading="loading"
      @create-conversation="handleCreateConversation"
    />
  </div>
</template>