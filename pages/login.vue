<script setup lang="ts">
import { z } from 'zod';
import { useSupabaseClient } from '#imports';
import type { Database } from '~/types/supabase.type';
import type { AuthError } from '@supabase/supabase-js';

const supabase = useSupabaseClient<Database>();

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
});

const state = reactive({
  email: '',
  password: '',
});

const loading = ref<boolean>(false);
const error = ref<string>('');
const toast = useToast();

async function onSubmit() {
  loading.value = true;
  
  try {
    const { error: authError } = await supabase.auth.signInWithPassword(state);
    if (authError) throw authError;
    
    toast.add({
      title: 'Connexion réussie',
      description: 'Vous êtes maintenant connecté',
      color: 'green'
    });
    await navigateTo('/');
  } catch (err: unknown) {
    const authError = err as AuthError;
    error.value = authError.message || 'Une erreur est survenue lors de l\'inscription';
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
          Connexion
        </h2>
      </div>

      <UAlert 
        v-if="error" 
        icon="i-heroicons-exclamation-triangle"
        color="red"
        variant="solid"
        :title="error"
        :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link', padded: false }"
        @close="error = ''"
      />

      <UForm :schema="schema" :state="state" @submit="onSubmit" class="mt-8 space-y-6">
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" type="email" placeholder="votre@email.com" />
        </UFormGroup>
        
        <UFormGroup label="Mot de passe" name="password">
          <UInput v-model="state.password" type="password" placeholder="••••••••" />
        </UFormGroup>
        
        <UButton type="submit" block :loading="loading">
          Se connecter
        </UButton>
      </UForm>
    </div>
  </div>
</template>