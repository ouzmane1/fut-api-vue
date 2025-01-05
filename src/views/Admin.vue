<template>
  <div class="bg-gray-100 min-h-screen p-6">
    <!-- Titre -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-blue-800">Tous les Joueurs</h1>
      <p class="text-sm text-gray-600">Utilisez les filtres pour affiner votre recherche</p>
    </div>

    

    <!-- Popup de création de joueur -->
    <div v-if="showCreatePlayerPopup" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-white p-6 rounded-md shadow-md w-96">
        <h2 class="text-xl font-bold mb-4">Ajouter un joueur</h2>
        <form @submit.prevent="createPlayer">
          <div class="mb-4">
            <label for="newPlayerName" class="block text-sm font-medium text-gray-700">Nom</label>
            <input
              id="newPlayerName"
              type="text"
              v-model="newPlayer.name"
              @input="checkPlayerName"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Nom du joueur"
            />
            <p v-if="nameExists" class="text-red-500 text-sm mt-1">Ce nom existe déjà.</p>
          </div>
          <div class="mb-4">
            <label for="newPlayerClub" class="block text-sm font-medium text-gray-700">Club</label>
            <div class="flex gap-2">
              <select
                id="newPlayerClub"
                v-model="newPlayer.club"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Sélectionner un club</option>
                <option v-for="club in availableClubs" :key="club" :value="club">{{ club }}</option>
              </select>
              <input
                v-if="newPlayer.club && !availableClubs.includes(newPlayer.club)"
                id="newPlayerClubCustom"
                type="text"
                v-model="newPlayer.club"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ou saisir un autre club"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="newPlayerNation" class="block text-sm font-medium text-gray-700">Nation</label>
            <div class="flex gap-2">
              <select
                id="newPlayerNation"
                v-model="newPlayer.nation"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Sélectionner une nation</option>
                <option v-for="nation in availableNations" :key="nation" :value="nation">{{ nation }}</option>
              </select>
              <input
                v-if="newPlayer.nation && !availableNations.includes(newPlayer.nation)"
                id="newPlayerNationCustom"
                type="text"
                v-model="newPlayer.nation"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ou saisir une autre nation"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="newPlayerRating" class="block text-sm font-medium text-gray-700">Note</label>
            <input
              id="newPlayerRating"
              type="number"
              v-model.number="newPlayer.rating"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Note du joueur"
            />
          </div>
          <div class="mb-4">
            <label for="newPlayerRarity" class="block text-sm font-medium text-gray-700">Rareté</label>
            <select
              id="newPlayerRarity"
              v-model="newPlayer.rarity"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Sélectionner la rareté</option>
              <option value="Common">Commun</option>
              <option value="Rare">Rare</option>
              <option value="Epic">Épique</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="newPlayerType" class="block text-sm font-medium text-gray-700">Type</label>
            <select
              id="newPlayerType"
              v-model="newPlayer.type"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Sélectionner le type</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Argent</option>
              <option value="Gold">Or</option>
              <option value="Icon">Icône</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="newPlayerPrice" class="block text-sm font-medium text-gray-700">Prix</label>
            <input
              id="newPlayerPrice"
              type="number"
              v-model.number="newPlayer.price"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Prix du joueur"
            />
          </div>
          <div class="mb-4">
            <label for="newPlayerRate" class="block text-sm font-medium text-gray-700">Taux (%)</label>
            <input
              id="newPlayerRate"
              type="number"
              v-model.number="newPlayer.rate"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Taux du joueur"
            />
          </div>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">Ajouter</button>
          <button @click="closeCreatePlayerPopup" class="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700">Annuler</button>
        </form>
      </div>
    </div>

    <!-- Affichage des filtres appliqués -->
    <div v-if="appliedFilters.length" class="bg-white p-4 rounded-md shadow-md mb-6">
      <h3 class="text-lg font-bold text-gray-800">Filtres appliqués :</h3>
      <div class="flex flex-wrap gap-2 text-sm text-gray-600">
        <div
          v-for="(filter, index) in appliedFilters"
          :key="index"
          class="flex items-center bg-gray-100 p-2 rounded"
        >
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


    <!-- Bouton pour ouvrir la popup de création de joueur -->
    <button @click="openCreatePlayerPopup" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-6">
      +
    </button>


    <!-- Tableau des joueurs -->
    <div v-if="loading" class="text-center text-gray-500">Chargement...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else>
      <table class="min-w-full bg-white shadow-md rounded-md">
        <thead>
          <tr class="bg-blue-800 text-white text-left">
            <th class="py-3 px-4 cursor-pointer" @click="sortTable('name')">
              Nom
              <span v-if="sortKey === 'name'">
                <span v-if="sortOrder === 'asc'">↑</span>
                <span v-else>↓</span>
              </span>
            </th>
            <th class="py-3 px-4 cursor-pointer" @click="sortTable('club')">
              Club
              <span v-if="sortKey === 'club'">
                <span v-if="sortOrder === 'asc'">↑</span>
                <span v-else>↓</span>
              </span>
            </th>
            <th class="py-3 px-4 cursor-pointer" @click="sortTable('nation')">
              Nation
              <span v-if="sortKey === 'nation'">
                <span v-if="sortOrder === 'asc'">↑</span>
                <span v-else>↓</span>
              </span>
            </th>
            <th class="py-3 px-4 cursor-pointer" @click="sortTable('rating')">
              Note
              <span v-if="sortKey === 'rating'">
                <span v-if="sortOrder === 'asc'">↑</span>
                <span v-else>↓</span>
              </span>
            </th>
            <th class="py-3 px-4 cursor-pointer" @click="sortTable('rarity')">
              Rareté
              <span v-if="sortKey === 'rarity'">
                <span v-if="sortOrder === 'asc'">↑</span>
                <span v-else>↓</span>
              </span>
            </th>
            <th class="py-3 px-4 cursor-pointer" @click="sortTable('type')">
              Type
              <span v-if="sortKey === 'type'">
                <span v-if="sortOrder === 'asc'">↑</span>
                <span v-else>↓</span>
              </span>
            </th>
            <th class="py-3 px-4 cursor-pointer" @click="sortTable('price')">
              Prix
              <span v-if="sortKey === 'price'">
                <span v-if="sortOrder === 'asc'">↑</span>
                <span v-else>↓</span>
              </span>
            </th>
            <th class="py-3 px-4 cursor-pointer" @click="sortTable('rate')">
              Taux (%)
              <span v-if="sortKey === 'rate'">
                <span v-if="sortOrder === 'asc'">↑</span>
                <span v-else>↓</span>
              </span>
            </th>
            <th class="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(player, index) in sortedPlayers"
            :key="player.id"
            :class="{'bg-gray-100': player.isEditing}"
          >
            <td class="py-3 px-4">
              <input
                v-if="player.isEditing"
                v-model="player.name"
                class="w-full px-2 py-1 border rounded-md"
                type="text"
              />
              <span v-else>{{ player.name }}</span>
            </td>
            <td class="py-3 px-4">
              <input
                v-if="player.isEditing"
                v-model="player.club"
                class="w-full px-2 py-1 border rounded-md"
                type="text"
              />
              <span v-else>{{ player.club }}</span>
            </td>
            <td class="py-3 px-4">
              <input
                v-if="player.isEditing"
                v-model="player.nation"
                class="w-full px-2 py-1 border rounded-md"
                type="text"
              />
              <span v-else>{{ player.nation }}</span>
            </td>
            <td class="py-3 px-4">
              <input
                v-if="player.isEditing"
                v-model="player.rating"
                class="w-full px-2 py-1 border rounded-md"
                type="number"
              />
              <span v-else>{{ player.rating }}</span>
            </td>
            <td class="py-3 px-4">
              <input
                v-if="player.isEditing"
                v-model="player.rarity"
                class="w-full px-2 py-1 border rounded-md"
                type="text"
              />
              <span v-else>{{ player.rarity }}</span>
            </td>
            <td class="py-3 px-4">
              <input
                v-if="player.isEditing"
                v-model="player.type"
                class="w-full px-2 py-1 border rounded-md"
                type="text"
              />
              <span v-else>{{ player.type }}</span>
            </td>
            <td class="py-3 px-4">
              <input
                v-if="player.isEditing"
                v-model="player.price"
                class="w-full px-2 py-1 border rounded-md"
                type="number"
              />
              <span v-else>{{ player.price }} crédits</span>
            </td>
            <td class="py-3 px-4">
              <input
                v-if="player.isEditing"
                v-model="player.rate"
                class="w-full px-2 py-1 border rounded-md"
                type="number"
              />
              <span v-else>{{ (player.rate * 100).toFixed(2) }}%</span>
            </td>
            <td class="py-3 px-4">
              <button
                v-if="player.isEditing"
                @click="confirmEditPlayer(player, index)"
                class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Sauvegarder
              </button>
              <button
                v-else
                @click="editPlayer(player)"
                class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
              >
                Éditer
              </button>
              <button
                @click="confirmDeletePlayer(index)"
                class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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

    <!-- Popup de confirmation pour la suppression -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-white p-6 rounded-md shadow-md w-96">
        <p class="text-lg font-bold mb-4">Confirmer la suppression</p>
        <p class="mb-4">Êtes-vous sûr de vouloir supprimer ce joueur ?</p>
        <div class="flex justify-end">
          <button @click="cancelDeletePlayer" class="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700">Annuler</button>
          <button @click="deletePlayerConfirmed" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700">Supprimer</button>
        </div>
      </div>
    </div>

    <!-- Popup de confirmation pour l'édition -->
    <div v-if="showEditConfirmation" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-white p-6 rounded-md shadow-md w-96">
        <p class="text-lg font-bold mb-4">Confirmer l'édition</p>
        <p class="mb-4">Êtes-vous sûr de vouloir enregistrer les modifications ?</p>
        <div class="flex justify-end">
          <button @click="cancelEditPlayer" class="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700">Annuler</button>
          <button @click="savePlayerConfirmed" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700">Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AllPlayers",
  data() {
    return {
      players: [],
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
      showDeleteConfirmation: false,
      showEditConfirmation: false,
      showCreatePlayerPopup: false,
      playerToDeleteIndex: null,
      playerToEdit: null,
      playerToEditIndex: null,
      newPlayer: {
        name: "",
        club: "",
        nation: "",
        rating: null,
        rarity: "",
        type: "",
        price: null,
        rate: null,
      },
      nameExists: false,
      sortKey: null,
      sortOrder: 'asc', // 'asc' ou 'desc'
    };
  },
  computed: {
    appliedFilters() {
      let applied = [];
      for (const [key, value] of Object.entries(this.filters)) {
        if (value) applied.push({ key, value });
      }
      return applied;
    },
    totalPages() {
      return Math.ceil(this.total / this.limit);
    },
    sortedPlayers() {
      if (!this.sortKey) return this.players;
      return [...this.players].sort((a, b) => {
        const aValue = a[this.sortKey];
        const bValue = b[this.sortKey];
        if (this.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    },
  },
  methods: {
    async fetchPlayers() {
      this.loading = true;
      this.error = null;
      const params = { ...this.filters, page: this.page, limit: this.limit, sortKey: this.sortKey, sortOrder: this.sortOrder };
      try {
        const response = await axios.get("http://127.0.0.1:8000/soccerplayers/advanced-filter", { params });
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
        const response = await axios.get(
          "http://127.0.0.1:8000/soccerplayers/advanced-filter",
          {
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
      this.page = 1;
      this.fetchPlayers();
    },
    removeFilter(index) {
      const filterKey = this.appliedFilters[index].key;
      this.filters[filterKey] = filterKey.includes("rating") ? null : "";
      this.applyFilters();
    },
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.fetchPlayers();
      }
    },
    confirmDeletePlayer(index) {
      this.playerToDeleteIndex = index;
      this.showDeleteConfirmation = true;
    },
    cancelDeletePlayer() {
      this.showDeleteConfirmation = false;
      this.playerToDeleteIndex = null;
    },
    deletePlayerConfirmed() {
      const playerId = this.players[this.playerToDeleteIndex].id;
      axios.delete(`http://127.0.0.1:8000/api/soccerplayers/delete/${playerId}`)
        .then(() => {
          this.players.splice(this.playerToDeleteIndex, 1);
          this.showDeleteConfirmation = false;
          this.playerToDeleteIndex = null;
        })
        .catch(err => {
          console.error("Erreur lors de la suppression du joueur:", err);
          this.showDeleteConfirmation = false;
          this.playerToDeleteIndex = null;
        });
    },
    editPlayer(player) {
      player.isEditing = true;
    },
    confirmEditPlayer(player, index) {
      this.playerToEdit = player;
      this.playerToEditIndex = index;
      this.showEditConfirmation = true;
    },
    cancelEditPlayer() {
      this.showEditConfirmation = false;
      this.playerToEdit = null;
      this.playerToEditIndex = null;
    },
    savePlayerConfirmed() {
      axios.post(`http://127.0.0.1:8000/api/soccerplayers/update/${this.playerToEdit.id}`, this.playerToEdit)
        .then(() => {
          this.playerToEdit.isEditing = false;
          this.players.splice(this.playerToEditIndex, 1, { ...this.playerToEdit });
          this.showEditConfirmation = false;
          this.playerToEdit = null;
          this.playerToEditIndex = null;
        })
        .catch(err => {
          console.error("Erreur lors de la mise à jour du joueur:", err);
          this.showEditConfirmation = false;
          this.playerToEdit = null;
          this.playerToEditIndex = null;
        });
    },
    openCreatePlayerPopup() {
      this.showCreatePlayerPopup = true;
    },
    closeCreatePlayerPopup() {
      this.showCreatePlayerPopup = false;
      this.newPlayer = {
        name: "",
        club: "",
        nation: "",
        rating: null,
        rarity: "",
        type: "",
        price: null,
        rate: null,
      };
      this.nameExists = false;
    },
    async checkPlayerName() {
      if (this.newPlayer.name) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/soccerplayers/check-name`, {
            params: { name: this.newPlayer.name },
          });
          this.nameExists = response.data.exists;
        } catch (err) {
          console.error("Erreur lors de la vérification du nom du joueur:", err);
        }
      }
    },
    createPlayer() {
      if (this.nameExists) {
        alert("Ce nom existe déjà. Veuillez choisir un autre nom.");
        return;
      }
      axios.post("http://127.0.0.1:8000/api/soccerplayers/create", this.newPlayer)
        .then(() => {
          this.closeCreatePlayerPopup();
          this.fetchPlayers();
        })
        .catch(err => {
          console.error("Erreur lors de la création du joueur:", err);
        });
    },
    sortTable(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
      this.fetchPlayers();
    },
  },
  created() {
    this.fetchPlayers();
    this.fetchClubsAndNations();
  },
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
