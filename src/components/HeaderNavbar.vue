<template>
  <header class="m-8 mt-5 flex justify-center">
    <nav class="w-full mx-12 flex flex-row justify-between items-center">
      <!-- Élément aligné à gauche -->
      <router-link to="/" class="text-xl font-bold text-gray-800">
        <h1>FUTAPI</h1>
      </router-link>

      <!-- Élément aligné à droite -->
      <font-awesome-icon icon="user" class="text-gray-800 text-2xl cursor-pointer" />
    </nav>
  </header>
</template>

<script>
export default {
  name: "HeaderNavbar",
};
</script>

<style scoped>
/* Si vous voulez ajouter un style supplémentaire (optionnel) */
</style>
