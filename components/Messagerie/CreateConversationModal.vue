<script setup lang="ts">
import type { User } from '~/types/user.type';

interface Props {
  isOpen: boolean
  users: User[]
  selectedUserId: string | null
  newMessage: string
  loading: boolean
}

interface Emits {
  (e: 'update:isOpen', value: boolean): void
  (e: 'update:selectedUserId', value: string | null): void
  (e: 'update:newMessage', value: string): void
  (e: 'create-conversation'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <UModal :model-value="isOpen" @update:model-value="emit('update:isOpen', $event)">
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
            v-if="users.length > 0 && selectedUserId"
            :model-value="selectedUserId"
            @update:model-value="emit('update:selectedUserId', $event)"
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
          <UTextarea 
            :model-value="newMessage"
            @update:model-value="emit('update:newMessage', $event)"
            class="w-full" 
            placeholder="Message..." 
          />
        </div>
        <UButton 
          icon="i-heroicons:paper-airplane-solid" 
          label="Send"
          class="w-full justify-center"
          :disabled="newMessage === ''"
          :loading="loading"
          @click="emit('create-conversation')"
        />
      </div>
    </UCard>
  </UModal>
</template>
