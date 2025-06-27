<script setup lang="ts">
import type { User } from '~/types/user.type';

definePageMeta({
  middleware: ["guest"]
})

const search = ref<string>('');
const mock_messages: {user: string, last_message: string, status: string}[] = [];
const filteredMessages = computed(() => {
  if (search.value === "") {
    return mock_messages;
  }
  return mock_messages.filter(item => 
    item.user.toLowerCase().startsWith(search.value.toLowerCase())
  );
});

// const messages = ref<string[]>([]);
const message = ref<string>('');

const modal = ref<boolean>(false);
const usersRawData: User[] = await $fetch('/api/users');
const users: string[] = usersRawData.map((user) => user.display_name);
const user = computed<string>(() => {
  if (users.length === 0) {
    return "";
  }
  return users[0];
});
const userOptions = computed<{label: string, value: string}[]>(() => {
  if (users.length === 0) {
    return [{ label: "Aucun utilisateur n'est trouvé", value: "", disabled: true }];
  }
  return users.map(u => ({ label: u, value: u }));
});
const newMessage = ref<string>('');

</script>

<template>
  <div class="w-full min-h-[calc(100vh-56px-32px)] grid grid-cols-5 gap-0 px-3">

    <!-- List de conversation -->
    <div class="w-full h-[calc(100vh-56px-32px)]">
      <div class="w-full h-auto pr-3 mb-3 flex items-start justify-start">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Recherche..." class="w-full" :disabled="filteredMessages.length === 0" />
      </div>

      <div class="w-full h-[calc(100vh-56px-32px-44px)] flex flex-col flex-nowrap border border-r-0 border-emerald-800 dark:border-emerald-200 rounded px-2 py-3 space-y-2 overflow-y-auto">
        <div v-if="filteredMessages.length === 0">
          <div class="w-full h-full flex items-center justify-center">
            <h1 class="font-bold text-xl">Pas de discussion commencée</h1>
          </div>
        </div>
        <div
          v-else
          v-for="item of filteredMessages"
          :key="item.user"
          class="w-full h-auto border-2 p-2 rounded bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900 hover:dark:bg-emerald-800 cursor-pointer flex justify-between items-center"
        >
          <div>
            <h1 class="font-bold text-xl">{{ item.user }}</h1>
            <p class="w-full text-justify line-clamp-1 overflow-hidden">{{ item.last_message }}</p>
          </div>
          <span
            class="text-xs font-semibold px-2 py-1 ml-2 rounded"
            :class="{
              'bg-blue-200 text-blue-800': item.status === 'Lu',
              'bg-green-200 text-green-800': item.status === 'Reçu',
              'bg-yellow-200 text-yellow-800': item.status === 'Envoyé',
            }"
          >
            {{ item.status }}
          </span>
        </div>
      </div>
    </div>

    <!-- Conversation -->
    <div class="w-full h-full border border-emerald-800 dark:border-emerald-200 rounded col-span-4 flex flex-col justify-end">
      <div class="w-full h-full flex items-center justify-center">
        <h1 class="font-bold text-xl">Pas de discussion selectionnée</h1>
      </div>
      <div class="w-full flex px-2 py-4 space-x-2">
        <UInput v-model="message" class="w-full" placeholder="Message..." :disabled="true" />
        <UButton icon="i-heroicons:paper-airplane-solid" label="Send" :disabled="message === ''" />
      </div>
    </div>

    <!-- Creation de nouvelle conversation -->
    <UButton  icon="i-heroicons:plus-20-solid"
              class="absolute top-[64px] right-5 size-10 rounded-full flex items-center justify-center"
              @click="modal = true" />

    <UModal v-model="modal">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="w-full">
            <h1 class="text-center text-xl font-bold">Création d'une nouvelle discussion</h1>
          </div>
        </template>

        <div class="w-full flex flex-col justify-start items-start space-y-3">
          <div class="w-full flex flex-col space-y-3">
            <h2 class="font-bold text-xl">Utilisateur</h2>
            <USelect v-model="user" :options="userOptions" class="w-full" />
          </div>
          <div class="w-full flex flex-col space-y-3">
            <h2 class="font-bold text-xl">Message</h2>
            <UTextarea v-model="newMessage" class="w-full" placeholder="Message..." />
          </div>
          <UButton 
            icon="i-heroicons:paper-airplane-solid" 
            label="Send"
            class="w-full justify-center"
            :disabled="newMessage === ''"
          />
        </div>
      </UCard>
    </UModal>
  </div>
</template>