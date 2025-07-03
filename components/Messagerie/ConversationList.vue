<script setup lang="ts">
import type { ConversationShort } from '~/types/conversation.type';

interface Props {
  conversations: ConversationShort[]
  search: string
  isVisible: boolean
}

interface Emits {
  (e: 'update:search', value: string): void
  (e: 'select-conversation', conversationId: string): void
  (e: 'create-conversation'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const filtredConversation = computed<ConversationShort[]>(() => {
  if (props.search === '') {
    return props.conversations;
  }
  return props.conversations.filter((conversation: ConversationShort) => {
    return conversation.user.display_name.toLowerCase().startsWith(props.search.toLowerCase());
  });
})

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
</script>

<template>
  <div class="w-full h-[calc(100vh-56px-32px)]" :class="{ 'hidden': !isVisible }">
    <div class="w-full h-auto pr-3 mb-3 flex items-start justify-start">
      <UInput 
        :model-value="search" 
        @update:model-value="emit('update:search', $event)"
        icon="i-heroicons-magnifying-glass-20-solid" 
        placeholder="Recherche..." 
        class="w-full" 
      />
    </div>
    
    <div class="w-full h-[calc(100vh-56px-32px-44px)] flex flex-col flex-nowrap border lg:border-r-0 border-emerald-800 dark:border-emerald-200 rounded px-2 py-3 space-y-2 overflow-y-auto">
      <UButton
        icon="i-heroicons:plus-20-solid"
        label="Nouvelle conversation"
        class="w-full flex items-center justify-center"
        @click="emit('create-conversation')"
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
        @click="emit('select-conversation', conversation.id)"
      >
        <div class="min-w-0 flex-1">
          <h1 class="font-bold text-lg lg:text-xl truncate">{{ conversation.user.display_name }} ({{ conversation.user.email }})</h1>
          <p class="w-full text-justify line-clamp-1 overflow-hidden text-sm lg:text-base">{{ conversation.last_message.content }}</p>
          <p class="w-full text-right text-gray-500 dark:text-gray-400">{{ getDate(conversation.last_message.created_at) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
