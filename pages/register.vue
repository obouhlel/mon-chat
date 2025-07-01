<script setup lang="ts">
import { z } from 'zod';
import { useSupabaseClient } from '#imports';
import type { Database } from '~/types/supabase.type';
import type { AuthError } from '@supabase/supabase-js';

definePageMeta({
  middleware: ['auth'],
})

const supabase = useSupabaseClient<Database>();

const schema = z.object({
  display_name: z.string().min(3, 'Le nom d\'affichage doit contenir au moins 3 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
});

const state = reactive({
  display_name: '',
  email: '',
  password: '',
  confirm_password: '',
});

const toast = useToast();
const loading = ref<boolean>(false);
const error = ref<string>('');

async function onSubmit() {
  loading.value = true;
  error.value = '';
  
  try {
    if (state.password !== state.confirm_password) {
      throw new Error("Les mots de passe ne correspondent pas");
    }
    const data = {
      email: state.email,
      password: state.password,
      options: {
        data: {
          display_name: state.display_name,
        }
      }
    }
    const { error: signUpError } = await supabase.auth.signUp(data);
    if (signUpError) throw signUpError;

    toast.add({
      title: 'Inscription réussie',
      description: 'Vérifiez votre email pour confirmer votre compte',
      color: 'green'
    });
    
    await navigateTo('/login');
  } catch (err: unknown) {
    const authError = err as AuthError;
    error.value = authError.message || 'Une erreur est survenue lors de l\'inscription';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="w-full min-h-[calc(100vh-56px-32px)] px-5 flex flex-col gap-5 items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold">
          Créer un compte
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
      
      <UForm :schema="schema" :state="state" class="mt-8 space-y-6" @submit="onSubmit">
        <UFormGroup label="Display Name" name="display_name">
          <UInput v-model="state.display_name" type="text" placeholder="Display Name" />
        </UFormGroup>

        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" type="email" placeholder="votre@email.com" />
        </UFormGroup>
        
        <UFormGroup label="Mot de passe" name="password">
          <UInput v-model="state.password" type="password" placeholder="••••••••" />
        </UFormGroup>

        <UFormGroup label="Confirmation du mot de passe" name="password">
          <UInput v-model="state.confirm_password" type="password" placeholder="••••••••" />
        </UFormGroup>
        
        <UButton type="submit" class="w-full" :loading="loading">
          S'inscrire
        </UButton>
      </UForm>
    </div>
  </div>
</template>