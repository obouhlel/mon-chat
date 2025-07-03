<script setup lang="ts">
import type { MessageList } from '~/types/message.type';

interface Props {
  messages: MessageList[]
  currentUserId?: string
  conversationName: string
  isVisible: boolean
  isMobile: boolean
  message: string
  isConversationSelected: boolean
}

interface Emits {
  (e: 'back-to-conversations'): void
  (e: 'update:message', value: string): void
  (e: 'send-message'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const messagesContainer = ref<HTMLElement | null>(null);

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

async function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    emit('send-message');
  }
}

// Expose scrollToBottom pour l'utiliser depuis le parent
defineExpose({
  scrollToBottom
})
</script>

<template>
  <div class="w-full h-[calc(100vh-56px-32px)] flex flex-col border border-emerald-800 dark:border-emerald-200 rounded lg:col-span-4" :class="{ 'hidden': !isVisible }">
    <div v-if="messages.length > 0" class="w-full p-3 border-b border-emerald-800 dark:border-emerald-200 flex items-center gap-3">
      <UButton
        v-if="isMobile"
        icon="i-heroicons:arrow-left-20-solid" 
        variant="ghost" 
        @click="emit('back-to-conversations')" 
      />
      <h2 class="font-bold text-lg truncate">{{ conversationName }}</h2>
    </div>
    
    <div
      v-if="messages.length > 0"
      ref="messagesContainer"
      class="w-full flex-1 px-3 py-4 flex flex-col gap-5 items-start justify-start overflow-y-auto"
    >
      <div
        v-for="(message, index) of messages"
        :key="index"
        class="w-full flex"
        :class="message.user.id === currentUserId ? 'justify-end' : 'justify-start'"
      >
        <div
          class="w-full max-w-[85%] lg:w-[50%] flex items-start justify-start gap-1 border-2 border-emerald-800 dark:border-emerald-200 p-2 rounded"
          :class="message.user.id === currentUserId ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-emerald-200 dark:bg-emerald-800'"
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
      <UInput 
        :model-value="message"
        @update:model-value="emit('update:message', $event)"
        class="w-full" 
        placeholder="Message..." 
        :disabled="!isConversationSelected" 
        @keydown="handleKeyPress" 
      />
      <UButton 
        icon="i-heroicons:paper-airplane-solid" 
        label="Send" 
        :disabled="message === '' || !isConversationSelected" 
        @click="emit('send-message')" 
      />
    </div>
  </div>
</template>
