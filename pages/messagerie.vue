<script setup lang="ts">
definePageMeta({
  middleware: ["guest"]
})

const search = ref<string>('');

const filteredMessages = computed(() => {
  if (search.value === "") {
    return mock_messages;
  }
  return mock_messages.filter(item => 
    item.user.toLowerCase().startsWith(search.value.toLowerCase())
  );
});

const mock_messages = [
  {
    user: "Oussama",
    status: "Lu",
    last_message: "Hello !",
  },
  {
    user: "Marie",
    status: "Lu",
    last_message: "Comment ça va ?",
  },
  {
    user: "Thomas",
    status: "Lu",
    last_message: "À bientôt !",
  },
  {
    user: "Sophie",
    status: "Lu",
    last_message: "Merci pour ton aide",
  },
  {
    user: "Lucas",
    status: "Envoyé",
    last_message: "Tu es libre ce soir ?",
  },
  {
    user: "Emma",
    status: "Reçu",
    last_message: "C'était génial !",
  },
  {
    user: "Antoine",
    status: "Lu",
    last_message: "On se voit demain",
  },
  {
    user: "Léa",
    status: "Envoyé",
    last_message: "Bonne soirée !",
  },
  {
    user: "Nicolas",
    status: "Lu",
    last_message: "Parfait, merci !",
  },
  {
    user: "Camille",
    status: "Reçu",
    last_message: "J'arrive dans 5 minutes",
  },
  {
    user: "Julien",
    status: "Lu",
    last_message: "Super idée !",
  },
  {
    user: "Manon",
    status: "Envoyé",
    last_message: "Tu as vu le film ?",
  },
  {
    user: "Pierre",
    status: "Lu",
    last_message: "C'est noté dans mon agenda",
  },
  {
    user: "Clara",
    status: "Reçu",
    last_message: "Excellente nouvelle !",
  },
  {
    user: "Maxime",
    status: "Lu",
    last_message: "Je confirme pour demain",
  },
  {
    user: "Alice",
    status: "Envoyé",
    last_message: "Merci beaucoup !",
  },
  {
    user: "Romain",
    status: "Lu",
    last_message: "Ça marche pour moi",
  },
  {
    user: "Chloé",
    status: "Reçu",
    last_message: "À plus tard !",
  },
  {
    user: "Vincent",
    status: "Lu",
    last_message: "Très bonne idée",
  },
  {
    user: "Océane",
    status: "Envoyé",
    last_message: "Je suis d'accord",
  },
  {
    user: "Romain",
    status: "Lu",
    last_message: "Ça marche pour moi",
  },
  {
    user: "Chloé",
    status: "Reçu",
    last_message: "À plus tard !",
  },
  {
    user: "Vincent",
    status: "Envoyé",
    last_message: "Très bonne idée",
  },
  {
    user: "Océane",
    status: "Lu",
    last_message: "Je suis d'accord",
  }
]
</script>

<template>
  <div class="w-full min-h-[calc(100vh-56px-32px)] grid grid-cols-5 gap-0 px-3">
    <div class="w-full h-[calc(100vh-56px-32px)]">
      <div class="w-full h-auto pr-3 mb-3 flex items-start justify-start">
        <UInput v-model="search" label="Recherche" class="w-full" />
      </div>

      <div class="w-full max-h-[calc(100vh-56px-32px-44px)] flex flex-col flex-nowrap border-2 px-2 py-3 space-y-2 overflow-y-auto">
        <div v-for="item of filteredMessages" :key="item.user" class="w-full h-auto border-2 p-2 rounded bg-emerald-100 dark:bg-emerald-900 cursor-pointer">
          <h1 class="font-bold text-xl">{{ item.user }}</h1>
          <p class="text-justify truncate">{{ item.last_message }}</p>
        </div>
      </div>
    </div>


    <div class="w-full h-full border col-span-4">
      DISCUSSION
    </div>
  </div>
</template>