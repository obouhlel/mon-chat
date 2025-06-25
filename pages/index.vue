<script setup lang="ts">
import { useSupabaseUser } from '#imports';

const user = useSupabaseUser();
const supabase = useSupabaseClient();

async function logout() {
  await supabase.auth.signOut();
}
</script>

<template>
  <div class="w-full min-h-[calc(100vh-56px-32px)] flex items-center justify-center">
    <div v-if="user" class="flex flex-col items-center justify-center gap-5">
      <h1 class="text-2xl font-bold">Bienvenue, {{ user.user_metadata.display_name }}</h1>
      <p>C'est une application de messagerie</p>
      <div class="flex gap-3">
        <UButton label="Se deconnecter" @click="logout" />
        <UButton label="Messagerie" to="/messagerie" />
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center gap-5">
      <h1 class="text-2xl font-bold">Bienvenue</h1>
      <p>C'est une application de messagerie</p>
      <div class="flex gap-3">
        <UButton label="S'inscrire" to="/register" />
        <UButton label="Se connecter" to="/login" />
      </div>
    </div>
  </div>
</template>