<script setup lang="ts">
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
});

const state = reactive({
  email: '',
  password: ''
});

const loading = ref(false)

async function onSubmit() {
  loading.value = true;
  try {
    console.log('Inscription:', state);
    // LOGIQUE AVEC SUPABASE
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="w-full min-h-[calc(100vh-56px-32px)] flex flex-col gap-5 items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold">
          Créer un compte
        </h2>
      </div>
      <UForm :schema="schema" :state="state" class="mt-8 space-y-6" @submit="onSubmit">
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" type="email" placeholder="votre@email.com" />
        </UFormGroup>
        
        <UFormGroup label="Mot de passe" name="password">
          <UInput v-model="state.password" type="password" placeholder="••••••••" />
        </UFormGroup>
        
        <UButton type="submit" class="w-full" :loading="loading">
          S'inscrire
        </UButton>
      </UForm>
    </div>
  </div>
</template>