<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center">
    <!-- Titre de la page -->
    <h1 class="text-3xl font-bold text-center mt-8 mb-6">{{ title }}</h1>

    <!-- Conteneur des boutons -->
    <div class="flex flex-col items-center space-y-6 mt-10">
      <!-- Bouton Ouvrir Pack -->
      <router-link
        to="/open-pack"
        class="w-80 bg-blue-500 text-white py-3 px-4 rounded-lg text-center hover:bg-blue-600"
      >
        Ouvrir Pack
      </router-link>

      <!-- Bouton Consulter mes joueurs -->
      <router-link
        to="/consult-my-players"
        class="w-80 bg-blue-500 text-white py-3 px-4 rounded-lg text-center hover:bg-blue-600"
      >
        Consulter mes joueurs
      </router-link>

      <!-- Bouton Consulter tous les joueurs -->
      <router-link
        to="/consult-all-players"
        class="w-80 bg-blue-500 text-white py-3 px-4 rounded-lg text-center hover:bg-blue-600"
      >
        Consulter tous les joueurs
      </router-link>
    </div>

    <!-- Afficher les données JSON -->
    <div v-if="data" class="mt-10">
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeApi',
  data() {
    return {
      title: 'Home API',
      data: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:8000/api/user'); 
        this.data = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  },
};
</script>

