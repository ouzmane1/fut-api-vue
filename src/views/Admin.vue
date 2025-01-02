<template>
    <div class="bg-gray-100 min-h-screen p-6">
      <!-- Titre -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-blue-800">Espace administrateurs</h1>
      </div>
  
      <!-- Filtres -->
      <div class="bg-white shadow-md rounded-md p-4 mb-6 flex flex-wrap gap-4 items-end">
        <!-- Filtres ici -->
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
          <input
            id="club"
            type="text"
            v-model="filters.club"
            @input="applyFilters"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Rechercher par club"
          />
        </div>
      </div>
  
      <!-- Formulaire d'ajout de joueur -->
     <!-- Formulaire d'ajout de joueur -->
<div class="bg-white p-4 rounded-md shadow-md mt-6 mb-6">
  <h3 class="text-xl font-bold text-gray-800">Ajouter un joueur</h3>
  <form @submit.prevent="addPlayer">
    <div class="flex gap-4">
      <!-- Nom -->
      <input
        v-model="newPlayer.name"
        type="text"
        placeholder="Nom"
        required
        class="p-2 border rounded-md w-full"
      />
      
      <!-- Club -->
      <input
        v-model="newPlayer.club"
        type="text"
        placeholder="Club"
        required
        class="p-2 border rounded-md w-full"
      />
      
      <!-- Nation -->
      <input
        v-model="newPlayer.nation"
        type="text"
        placeholder="Nation"
        required
        class="p-2 border rounded-md w-full"
      />
      
      <!-- Note -->
      <input
        v-model="newPlayer.rating"
        type="number"
        placeholder="Note"
        required
        class="p-2 border rounded-md w-full"
      />
      
      <!-- Type -->
      <input
        v-model="newPlayer.type"
        type="text"
        placeholder="Type"
        required
        class="p-2 border rounded-md w-full"
      />
      
      <!-- Rate -->
      <input
        v-model="newPlayer.rate"
        type="number"
        placeholder="Rate"
        required
        class="p-2 border rounded-md w-full"
      />
      
      <!-- Prix -->
      <input
        v-model="newPlayer.price"
        type="number"
        placeholder="Prix"
        required
        class="p-2 border rounded-md w-full"
      />
      
      <!-- Bouton Ajouter -->
      <button type="submit" class="p-2 bg-blue-600 text-white rounded-md">Ajouter</button>
    </div>
  </form>
</div>

      <!-- Tableau des joueurs -->
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white shadow rounded-md">
          <thead>
            <tr class="text-left border-b">
              <th class="px-4 py-2">Nom</th>
              <th class="px-4 py-2">Club</th>
              <th class="px-4 py-2">Nation</th>
              <th class="px-4 py-2">Note</th>
              <th class="px-4 py-2">Type</th>
              <th class="px-4 py-2">Rate</th>
              <th class="px-4 py-2">Prix</th>
              <th class="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(player, index) in filteredPlayers" :key="player.id" class="border-b">
              <td class="px-4 py-2">
                <input
                  v-if="editingPlayer === player.id"
                  v-model="player.name"
                  class="border-gray-300 rounded-md"
                />
                <span v-else>{{ player.name }}</span>
              </td>
              <td class="px-4 py-2">
                <input
                  v-if="editingPlayer === player.id"
                  v-model="player.club"
                  class="border-gray-300 rounded-md"
                />
                <span v-else>{{ player.club }}</span>
              </td>
              <td class="px-4 py-2">
                <input
                  v-if="editingPlayer === player.id"
                  v-model="player.nation"
                  class="border-gray-300 rounded-md"
                />
                <span v-else>{{ player.nation }}</span>
              </td>
              <td class="px-4 py-2">
                <input
                  v-if="editingPlayer === player.id"
                  v-model="player.rating"
                  class="border-gray-300 rounded-md"
                />
                <span v-else>{{ player.rating }}</span>
              </td>
              <td class="px-4 py-2">
                <input
                  v-if="editingPlayer === player.id"
                  v-model="player.type"
                  class="border-gray-300 rounded-md"
                />
                <span v-else>{{ player.type }}</span>
              </td>
              <td class="px-4 py-2">
                <input
                  v-if="editingPlayer === player.id"
                  v-model="player.rate"
                  class="border-gray-300 rounded-md"
                />
                <span v-else>{{ player.rate }}</span>
              </td>
              <td class="px-4 py-2">
                <input
                  v-if="editingPlayer === player.id"
                  v-model="player.price"
                  class="border-gray-300 rounded-md"
                />
                <span v-else>{{ player.price }} crédits</span>
              </td>
              <td class="px-4 py-2">
                <button @click="editPlayer(player.id)" v-if="editingPlayer !== player.id" class="text-blue-600 hover:text-blue-800 mr-2">Éditer</button>
                <button @click="savePlayer(player.id)" v-if="editingPlayer === player.id" class="text-green-600 hover:text-green-800 mr-2">Sauvegarder</button>
                <button @click="deletePlayer(player.id)" class="text-red-600 hover:text-red-800">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "PlayerTable",
    data() {
      return {
        players: [], // Liste des joueurs
        newPlayer: {
          name: "",
          club: "",
          nation: "",
          rating: null,
          price: null,
        },
        filters: {
          name: "",
          club: "",
        },
        editingPlayer: null, // ID du joueur en cours d'édition
      };
    },
    computed: {
      // Liste filtrée des joueurs en fonction des filtres appliqués
      filteredPlayers() {
        return this.players.filter((player) => {
          return (
            (this.filters.name === "" || player.name.toLowerCase().includes(this.filters.name.toLowerCase())) &&
            (this.filters.club === "" || player.club.toLowerCase().includes(this.filters.club.toLowerCase()))
          );
        });
      },
    },
    methods: {
      // Charger les joueurs depuis l'API (ici un mock)
      async fetchPlayers() {
        // Remplacez ceci par un appel API réel pour récupérer les joueurs
        try {
          const response = await axios.get("http://127.0.0.1:8000/soccerplayers/advanced-filter");
          this.players = response.data.players;
        } catch (err) {
          console.error("Erreur lors du chargement des joueurs:", err);
        }
      },
      // Appliquer les filtres
      applyFilters() {
        this.fetchPlayers();
      },
      // Passer en mode édition pour un joueur
      editPlayer(playerId) {
        this.editingPlayer = playerId;
      },
      // Sauvegarder les modifications pour un joueur
      async savePlayer(playerId) {
        const player = this.players.find((p) => p.id === playerId);
        try {
          await axios.put(`http://127.0.0.1:8000/soccerplayers/${playerId}`, player);
          this.editingPlayer = null;
        } catch (err) {
          console.error("Erreur lors de la sauvegarde:", err);
        }
      },
      // Supprimer un joueur
      async deletePlayer(playerId) {
        try {
          await axios.delete(`http://127.0.0.1:8000/soccerplayers/${playerId}`);
          this.players = this.players.filter((player) => player.id !== playerId);
        } catch (err) {
          console.error("Erreur lors de la suppression:", err);
        }
      },
      // Ajouter un nouveau joueur
      async addPlayer() {
        try {
          const response = await axios.post("http://127.0.0.1:8000/soccerplayers/", this.newPlayer);
          this.players.push(response.data);
          this.newPlayer = {
            name: "",
            club: "",
            nation: "",
            rating: null,
            price: null,
          };
        } catch (err) {
          console.error("Erreur lors de l'ajout:", err);
        }
      },
    },
    created() {
      this.fetchPlayers();
    },
  };
  </script>
  
  <style scoped>
  /* Styles supplémentaires */
  </style>
  