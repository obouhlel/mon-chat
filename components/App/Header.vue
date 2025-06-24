<script setup lang="ts">
import { ref, onMounted } from 'vue';
const colorMode = useColorMode();
const modes = [
  { value: 'system', icon: 'uil:monitor', label: 'System' },
  { value: 'light', icon: 'uil:sun', label: 'Light' },
  { value: 'dark', icon: 'uil:moon', label: 'Dark' }
];
const mounted = ref<boolean>(false);

onMounted(() => {
  mounted.value = true;
})
</script>
<template>
  <header class="w-full h-12 px-2 py-3 mb-2 bg-emerald-200 dark:bg-emerald-800 flex justify-between">
    <h1 class="text-xl font-bold">Mon chat</h1>
    <div class="space-x-1 mt-[-3px]">
      <button v-for="mode in modes" :key="mode.value" class="cursor-pointer text-2xl font-bold transition-colors"
        :class="mounted && colorMode.preference === mode.value ? 'text-emerald-700 dark:text-emerald-500' : 'text-black dark:text-white'"
        :aria-label="mode.label" @click="colorMode.preference = mode.value">
        <Icon :name="mode.icon" />
      </button>
    </div>
  </header>
</template>