<template>
<HeaderNavbar/>
<!-- <HomeApi/> -->
<RouterView/>
</template>

<script>
import HeaderNavbar from './components/HeaderNavbar.vue';
// import HomeApi from './views/HomeApi.vue';

export default {
  name: "App",
  components: {
    HeaderNavbar,
    // HomeApi,
  },
};
</script>
