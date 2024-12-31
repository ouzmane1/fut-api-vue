<!-- src/components/UserInfo.vue -->
<template>
    <div v-if="userStore.isAuthenticated">
      <h2>Bienvenue, {{ userStore.currentUser.username }}!</h2>
      <!-- Affichez d'autres informations de l'utilisateur ici -->
    </div>
    <div v-else>
      <p>Veuillez vous connecter</p>
    </div>
  </template>
  
  <script setup>
  import { useUserStore } from '@/stores/user'
  
  const userStore = useUserStore()
  </script>