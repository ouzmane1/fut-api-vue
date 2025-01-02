<template>
  <div 
    class="min-h-screen flex flex-col items-center justify-center"
    style="background-image: url('https://sm.ign.com/ign_fr/gallery/f/fc-25-scre/fc-25-screenshots_y5cm.jpg'); background-size: cover; background-position: center;"
  >
    <!-- Overlay pour rendre le texte lisible -->
    <div class="bg-black bg-opacity-50 w-full min-h-screen flex flex-col items-center justify-center">
      <!-- Titre de la page -->
      <h1 class="text-5xl font-extrabold text-white text-center mb-12">
        {{ title }}
      </h1>
      <!-- Conteneur des boutons -->
      <div class="flex flex-col items-center space-y-8">
        <!-- Bouton Ouvrir Pack -->
        <router-link
          to="/open-pack"
          class="w-96 py-4 px-6 bg-gradient-to-r from-blue-400 to-indigo-600 text-white text-2xl font-bold rounded-full shadow-lg flex items-center justify-center hover:scale-105 transform transition duration-300"
        >
          Ouvrir Pack
        </router-link>

        <!-- Bouton Consulter mes joueurs -->
        <button
          class="w-96 py-4 px-6 bg-gradient-to-r from-green-400 to-teal-600 text-white text-2xl font-bold rounded-full shadow-lg flex items-center justify-center hover:scale-105 transform transition duration-300"
          @click="handleConsultPlayers"
        >
          Consulter mes joueurs
        </button>

        <!-- Bouton Consulter tous les joueurs -->
        <router-link
          to="/consult-all-players"
          class="w-96 py-4 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-2xl font-bold rounded-full shadow-lg flex items-center justify-center hover:scale-105 transform transition duration-300"
        >
          Consulter tous les joueurs
        </router-link>

        <!-- Bouton Admin (visible uniquement pour les administrateurs) -->
        <router-link
        v-if="isAdmin"
          @click="handleAdminAction"
          to="/admin"
          class="w-96 py-4 px-6 bg-gradient-to-r from-red-400 to-pink-600 text-white text-2xl font-bold rounded-full shadow-lg flex items-center justify-center hover:scale-105 transform transition duration-300"
        >
        Action Admin
        </router-link>
      </div>
    </div>
  </div>

  <!-- Popup Modal -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">Authentification requise</h3>
      <p class="modal-message">Vous devez vous inscrire ou vous connecter pour consulter vos joueurs.</p>
      <button class="modal-button" @click="closeModal">Fermer</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeApi',
  data() {
    return {
      title: 'FUT API - Accueil',
      data: null,
      showModal: false, // Variable pour afficher ou cacher la modal
      currentUser: {}, // Utilisateur actuel
    };
  },
  computed: {
  isAuthenticated() {
    // Vérifie si currentUser est défini. Si oui, retourne la condition, sinon false.
    return this.currentUser ? !!this.currentUser.id : false;
  },
  isAdmin() {
    // Vérifie si currentUser est défini et s'il contient un rôle admin.
    return this.currentUser ? this.currentUser.roles?.includes('ROLE_ADMIN') : false;
  },
},
  methods: {
    async fetchCurrentUser() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || !user.id) {
          throw new Error('Utilisateur non authentifié');
        }

        const response = await axios.get(`http://localhost:8000/api/users/${user.id}`);
        this.currentUser = response.data;
      } catch (error) {
        console.error('Error fetching current user:', error);
        this.currentUser = {};
      }
    },
    handleConsultPlayers() {
      if (!this.isAuthenticated) {
        // Si non authentifié, afficher la modal
        this.showModal = true;
      } else {
        // Si authentifié, rediriger vers la page des joueurs
        this.$router.push('/consult-my-players');
      }
    },
    handleAdminAction() {
      console.log('Action admin effectuée !');
      // Vous pouvez ajouter ici les actions spécifiques pour les administrateurs
    },
    closeModal() {
      this.showModal = false; // Ferme la modal lorsque l'utilisateur clique sur "Fermer"
    },
  },
  created() {
    this.fetchCurrentUser();
  },
};
</script>


<style scoped>
/* Réinitialisation de la mise en page */
.relative {
  font-family: "Poppins", sans-serif;
}

h1 {
  text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.6);
}

.grid {
  margin-top: 4rem;
  padding: 0 1rem;
}

.card {
  background: #1e293b;
  border-radius: 16px;
  overflow: hidden;
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
}

.card-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.card-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #e2e8f0;
}

.card-price {
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 1rem;
  color: #94a3b8;
}

.card-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #3b82f6, #6366f1);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.card-button:hover {
  background: linear-gradient(90deg, #2563eb, #4f46e5);
  transform: scale(1.05);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #1e293b;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  width: 300px;
  max-width: 90%;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 1rem;
}

.modal-message {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
}

.modal-button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.modal-button:hover {
  background: #2563eb;
}
</style>
