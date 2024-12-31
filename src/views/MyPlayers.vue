<template>
  <div class="bg-gray-100 min-h-screen p-6">
    <!-- Titre -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-blue-800">Mes Joueurs</h1>
      <p class="text-sm text-gray-600">Gérez vos joueurs ici</p>
    </div>

    <!-- Affichage des filtres appliqués -->
    <div v-if="appliedFilters.length" class="bg-white p-4 rounded-md shadow-md mb-6">
      <h3 class="text-lg font-bold text-gray-800">Filtres appliqués :</h3>
      <div class="flex flex-wrap gap-2 text-sm text-gray-600">
        <div v-for="(filter, index) in appliedFilters" :key="index" class="flex items-center bg-gray-100 p-2 rounded">
          <span class="font-medium capitalize">{{ filter.key }} : {{ filter.value }}</span>
          <button @click="removeFilter(index)" class="ml-2 text-red-500 hover:text-red-700">×</button>
        </div>
      </div>
    </div>

    <!-- Affichage du nombre de joueurs filtrés -->
    <div v-if="total" class="text-center text-gray-600 mb-6">
      <p>{{ total }} joueur{{ total > 1 ? 's' : '' }} trouvé{{ total > 1 ? 's' : '' }}</p>
    </div>

    <!-- Filtres -->
    <div class="bg-white shadow-md rounded-md p-4 mb-6 flex flex-wrap gap-4 items-end">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
        <input
          id="name"
          type="text"
          v-model="filters.name"
          @input="applyFilters"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Rechercher par nom"
        />
      </div>
      <div>
        <label for="club" class="block text-sm font-medium text-gray-700">Club</label>
        <div class="flex gap-2">
          <select
            id="club"
            v-model="filters.club"
            @change="applyFilters"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Sélectionner un club</option>
            <option v-for="club in availableClubs" :key="club" :value="club">{{ club }}</option>
          </select>
          <input
            v-if="filters.club && !availableClubs.includes(filters.club)"
            id="clubCustom"
            type="text"
            v-model="filters.club"
            @input="applyFilters"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Ou saisir un autre club"
          />
        </div>
      </div>
      <div>
        <label for="nation" class="block text-sm font-medium text-gray-700">Nation</label>
        <div class="flex gap-2">
          <select
            id="nation"
            v-model="filters.nation"
            @change="applyFilters"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Sélectionner une nation</option>
            <option v-for="nation in availableNations" :key="nation" :value="nation">{{ nation }}</option>
          </select>
          <input
            v-if="filters.nation && !availableNations.includes(filters.nation)"
            id="nationCustom"
            type="text"
            v-model="filters.nation"
            @input="applyFilters"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Ou saisir une autre nation"
          />
        </div>
      </div>
      <div>
        <label for="rating" class="block text-sm font-medium text-gray-700">Note</label>
        <div class="flex gap-2">
          <input
            id="minRating"
            type="number"
            v-model.number="filters.min_rating"
            @input="applyFilters"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Min"
          />
          <input
            id="maxRating"
            type="number"
            v-model.number="filters.max_rating"
            @input="applyFilters"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Max"
          />
        </div>
      </div>
      <div>
        <label for="rarity" class="block text-sm font-medium text-gray-700">Rareté</label>
        <select
          id="rarity"
          v-model="filters.rarity"
          @change="applyFilters"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Sélectionner la rareté</option>
          <option value="Common">Commun</option>
          <option value="Rare">Rare</option>
          <option value="Epic">Épique</option>
        </select>
      </div>
      <div>
        <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
        <select
          id="type"
          v-model="filters.type"
          @change="applyFilters"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Sélectionner le type</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Argent</option>
          <option value="Gold">Or</option>
          <option value="Icon">Icône</option>
        </select>
      </div>
    </div>

    <!-- Liste des joueurs -->
    <div v-if="loading" class="text-center text-gray-500">Chargement...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="player in players"
        :key="player.id"
        class="bg-white shadow rounded-md p-4"
      >
        <h3 class="text-lg font-bold text-gray-800">{{ player.name }}</h3>
        <p class="text-sm text-gray-600">Club : {{ player.club }}</p>
        <p class="text-sm text-gray-600">Nation : {{ player.nation }}</p>
        <p class="text-sm text-gray-600">Note : {{ player.rating }}</p>
        <p class="text-sm text-gray-600">Prix : {{ player.price }} crédits</p>
        <button @click="sellPlayer(player.idPackPlayer)" class="mt-2 bg-red-500 text-white px-4 py-2 rounded">Vendre</button>
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
  name: "AllPlayers",
  data() {
    return {
      players: [], // Liste des joueurs
      filters: {
        name: "",
        club: "",
        nation: "",
        min_rating: null,
        max_rating: null,
        rarity: "",
        type: "",
      },
      availableClubs: [], // Liste dynamique des clubs
      availableNations: [], // Liste dynamique des nations
      page: 1,
      limit: 20,
      total: 0,
      loading: true,
      error: null,
    };
  },
  computed: {
    appliedFilters() {
      let applied = [];
      for (const [key, value] of Object.entries(this.filters)) {
        if (value) {
          applied.push({ key, value });
        }
      }
      return applied;
    },
    totalPages() {
      return Math.ceil(this.total / this.limit);
    },
  },
  methods: {
    async fetchPlayers() {
      this.loading = true;
      this.error = null;

      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || !user.id) {
        this.error = 'Utilisateur non authentifié';
        this.loading = false;
        return;
      }

      const params = {
        ...this.filters,
        page: this.page,
        limit: this.limit,
      };

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/users/players/advanced-filter",
          {
            headers: {
              'X-User-Id': user.id,
            },
            params,
          }
        );
        this.players = response.data.players;
        this.total = response.data.total;
      } catch (err) {
        this.error = "Erreur lors de la récupération des joueurs.";
      } finally {
        this.loading = false;
      }
    },
    async fetchClubsAndNations() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
          this.error = 'Utilisateur non authentifié';
          return;
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/api/users/players/advanced-filter",
          {
            headers: {
              'X-User-Id': user.id,
            },
            params: { page: 1, limit: 100 },
          }
        );
        const clubs = new Set();
        const nations = new Set();

        response.data.players.forEach((player) => {
          clubs.add(player.club);
          nations.add(player.nation);
        });

        this.availableClubs = Array.from(clubs);
        this.availableNations = Array.from(nations);
      } catch (err) {
        this.error = "Erreur lors de la récupération des clubs et nations.";
      }
    },
    applyFilters() {
      this.page = 1; // Réinitialise la page à la première page lors du changement de filtre
      this.fetchPlayers();
    },
    removeFilter(index) {
      const filterKey = this.appliedFilters[index].key;

      // Réinitialise la valeur du filtre en fonction de son type
      switch(filterKey) {
        case 'name':
          this.filters.name = '';
          break;
        case 'club':
          this.filters.club = '';
          break;
        case 'nation':
          this.filters.nation = '';
          break;
        case 'min_rating':
          this.filters.min_rating = null;
          break;
        case 'max_rating':
          this.filters.max_rating = null;
          break;
        case 'rarity':
          this.filters.rarity = '';
          break;
        case 'type':
          this.filters.type = '';
          break;
      }

      this.applyFilters();
    },
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.fetchPlayers();
      }
    },
    async sellPlayer(userPackPlayerId) {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || !user.id) {
        this.error = 'Utilisateur non authentifié';
        return;
      }

      try {
        console.log('Selling player with ID:', userPackPlayerId);
        console.log('User ID:', user.id);

        const response = await axios.post(`http://127.0.0.1:8000/api/players/sell/${userPackPlayerId}`, {}, {
          headers: {
            'X-User-Id': user.id,
          },
        });

        console.log('Sell player response:', response.data);

        this.fetchPlayers(); // Rechargez la liste des joueurs après la vente
      } catch (err) {
        console.error('Error selling player:', err);
        this.error = 'Erreur lors de la vente du joueur.';
      }
    },
  },
  created() {
    this.fetchClubsAndNations();
    this.fetchPlayers();
  },
};
</script>

