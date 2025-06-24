<template>
  <div class="w-full min-h-screen flex flex-col overflow-x-hidden">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>