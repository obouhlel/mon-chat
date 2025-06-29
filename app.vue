<script setup lang="ts">
import { NuxtLayout, NuxtPage } from '#components';
useHead({
  title: 'Mon Chat',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>
