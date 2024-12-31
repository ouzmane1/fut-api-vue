<template>
  <div id="app">
    <HeaderNavbar />
    <router-view></router-view>
  </div>
</template>

<script>
import HeaderNavbar from './components/HeaderNavbar.vue';

export default {
  name: 'App',
  components: {
    HeaderNavbar
  }
};
</script>

<style>
/* Ajoutez vos styles globaux ici */
</style>
