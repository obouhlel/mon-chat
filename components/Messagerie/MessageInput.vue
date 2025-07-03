<script setup lang="ts">
interface Props {
  message: string
  isConversationSelected: boolean
}

interface Emits {
  (e: 'update:message', value: string): void
  (e: 'send-message'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

async function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    emit('send-message');
  }
}
</script>

<template>
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
</template>
