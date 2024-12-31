<template>
  <div class="bg-gray-100 min-h-screen p-6">
    <!-- Titre -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-blue-800">Mes Joueurs</h1>
      <p class="text-sm text-gray-600">Voici la liste de vos joueurs</p>
    </div>

    <!-- Affichage du nombre de joueurs -->
    <div v-if="total" class="text-center text-gray-600 mb-6">
      <p>{{ total }} joueur{{ total > 1 ? 's' : '' }} trouvé{{ total > 1 ? 's' : '' }}</p>
    </div>

    <!-- Liste des joueurs -->
    <div v-if="loading" class="text-center text-gray-500">Chargement...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="player in players"
        :key="player.id"
        class="bg-white rounded-lg shadow-md p-4"
      >
        <div class="border-b pb-2 mb-2">
          <h3 class="text-lg font-bold text-gray-800">{{ player.name }}</h3>
          <p class="text-xs text-gray-500">Obtenu le {{ new Date(player.obtained_at).toLocaleDateString() }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-gray-600">Club : {{ player.club }}</p>
          <p class="text-sm text-gray-600">Nation : {{ player.nation }}</p>
          <p class="text-sm text-gray-600">Note : {{ player.rating }}</p>
          <p class="text-sm text-gray-600">Prix : {{ player.price }} crédits</p>
          <p class="text-sm text-gray-600">Rareté : {{ player.rarity }}</p>
          <p class="text-sm text-gray-600">Type : {{ player.type }}</p>
        </div>
        <div class="mt-2 pt-2 border-t">
          <p class="text-sm font-medium text-blue-600">Pack {{ player.pack_name }} ({{ player.pack_type }})</p>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center items-center mt-6">
      <button
        @click="changePage(page - 1)"
        :disabled="page === 1"
        class="px-4 py-2 mx-1 rounded-md bg-gray-300 text-gray-600 disabled:opacity-50"
      >
        Précédent
      </button>
      <span class="text-gray-700 px-2">Page {{ page }} sur {{ totalPages }}</span>
      <button
        @click="changePage(page + 1)"
        :disabled="page === totalPages"
        class="px-4 py-2 mx-1 rounded-md bg-gray-300 text-gray-600 disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MyPlayers",
  data() {
    return {
      players: [],
      page: 1,
      limit: 20,
      total: 0,
      loading: true,
      error: null,
      userId: localStorage.getItem('userId') // Récupérer l'ID utilisateur du localStorage
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.limit);
    },
  },
  methods: {
      async fetchPlayers() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/soccerplayers/user", {
          headers: {
            'X-User-Id': this.userId
          },
          params: {
            page: this.page,
            limit: this.limit
          }
        });

        this.players = response.data.players;
        this.total = response.data.total;
      } catch (err) {
        this.error = "Erreur lors de la récupération des joueurs.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.fetchPlayers();
      }
    },
  },
  created() {
    if (!this.userId) {
      this.error = "Utilisateur non connecté";
      return;
    }
    this.fetchPlayers();
  },
};
</script>

<style scoped>
.bg-gray-100 {
  background-color: #f7fafc;
}
</style>
