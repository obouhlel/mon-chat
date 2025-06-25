<script setup lang="ts">
import { useSupabaseClient } from '#imports';
import type { Database } from '~/types/supabase.type';

const supabase = useSupabaseClient<Database>();

const { data, error } = await supabase.from('message').select('*').limit(1);
</script>

<template>
  <div class="w-full min-h-[calc(100vh-56px-32px)] flex items-center justify-center">
    <h1 v-if="data" class="text-2xl font-bold">{{ data[0].content }}, world !</h1>
    <h1 v-else class="text-red-500 font-bold">{{ error }}</h1>
  </div>
</template>