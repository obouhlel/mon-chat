<template>
  <div class="w-full min-h-[calc(100vh-56px-32px)] flex flex-col gap-5 items-center justify-center">
    <h1 class="text-2xl font-bold">Bienvenue</h1>
    <p>C'est une application de messagerie</p>
    <div class="flex gap-3">
      <UButton label="S'inscrire" to="/register" />
      <UButton label="Se connecter" to="/login" />
    </div>
  </div>
</template>