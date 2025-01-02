<template>
  <div class="bg-gradient-to-b from-blue-100 to-blue-200 min-h-screen flex flex-col items-center py-10">
    <!-- Titre -->
    <div class="text-center mb-10">
      <h1 class="text-4xl font-extrabold text-blue-800 uppercase tracking-wide">
        {{ packName }}
      </h1>
      <p class="text-sm text-blue-600 mt-2">Découvrez les joueurs de votre pack</p>
    </div>

    <!-- Contenu -->
    <div v-if="loading" class="text-center">
      <p class="text-xl text-gray-700 animate-pulse">Chargement des données...</p>
    </div>

    <!-- Premier joueur avec animation -->
    <div v-if="!loading && !error && firstPlayer" class="w-full max-w-lg mb-12">
      <div class="bg-white rounded-lg shadow-xl p-6 relative overflow-hidden max-h-[400px]">
        <div class="absolute inset-0 flex items-center justify-center" v-if="!animationFinished">
          <!-- Animation : Pays -->
          <p v-if="animationStep === 1" class="text-4xl font-bold text-gray-800 opacity-80">
            {{ firstPlayer.nation }}
          </p>
          <!-- Animation : Type -->
          <p v-else-if="animationStep === 2" class="text-4xl font-bold text-gray-800 opacity-80">
            {{ firstPlayer.type }}
          </p>
          <!-- Animation : Score avec compteur -->
          <p v-else-if="animationStep === 3" class="text-5xl font-extrabold text-blue-600 opacity-90">
            {{ animatedRating }}
          </p>
          <!-- Animation : Nom -->
          <p v-else-if="animationStep === 4" class="text-3xl font-bold text-gray-800 opacity-100">
            {{ firstPlayer.name }}
          </p>
        </div>
        <!-- Informations après animation -->
        <div v-if="animationFinished" class="text-center">
          <h3 class="text-2xl font-extrabold text-gray-800">{{ firstPlayer.name }}</h3>
          <p class="text-sm text-gray-600">{{ firstPlayer.club }}</p>
          <p class="text-sm text-gray-600">Note : <span class="text-yellow-500 font-semibold">{{ firstPlayer.rating }}</span></p>
          <p class="text-sm text-gray-600">Prix : {{ firstPlayer.price }} crédits</p>
        </div>
      </div>
    </div>

    <!-- Liste des autres joueurs -->
    <div v-if="!loading && !error && otherPlayersVisible" class="w-full max-w-5xl px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="player in otherPlayers" :key="player.id" class="bg-white rounded-lg shadow-xl p-6 transform transition duration-300 hover:scale-105">
          <h4 class="text-xl font-semibold text-gray-800">{{ player.name }}</h4>
          <p class="text-sm text-gray-600">{{ player.club }}</p>
          <p class="text-sm text-gray-600">Nation : {{ player.nation }}</p>
          <p class="text-sm text-gray-600">Note : {{ player.rating }}</p>
          <p class="text-sm text-gray-600">Prix : {{ player.price }} crédits</p>
        </div>
      </div>
    </div>

    <!-- Crédits restants -->
    <div v-if="!loading && !error" class="mt-8 text-center">
      <p class="text-xl font-bold text-blue-600">Crédits restants : {{ userCredits }}</p>
    </div>

    <!-- Bouton Reouvrir un pack -->
    <div v-if="!loading && !error" class="mt-8">
      <button 
        @click="reopenPack" 
        class="w-64 py-4 px-6 bg-gradient-to-r from-blue-400 to-indigo-600 text-white text-2xl font-bold rounded-full shadow-lg transform transition duration-300 hover:scale-105">
        Réouvrir un pack
      </button>
    </div>

    <!-- Bouton Retour au menu des packs -->
    <div v-if="!loading && !error" class="mt-4">
      <router-link 
        to="/open-pack" 
        class="w-64 py-4 px-6 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-2xl font-bold rounded-full shadow-lg transform transition duration-300 hover:scale-105">
        Retour au menu des packs
      </router-link>
    </div>

    <!-- Popup d'erreur si les crédits sont insuffisants -->
    <div v-if="showErrorPopup" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-8 rounded-lg shadow-xl text-center">
        <p class="text-2xl text-red-500 font-bold">{{ error }}</p>
        <div class="mt-4">
          <router-link
          to="/open-pack"
          class="px-6 py-2 bg-red-500 text-white text-xl font-bold rounded-full transform transition duration-300 hover:scale-105"
        >
          Fermer
        </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PackDetails",
  data() {
    return {
      packName: this.$route.params.title || "", // Type de pack passé dans l'URL
      packData: null, // Données récupérées depuis l'API
      loading: true, // Indicateur de chargement
      error: null, // Message d'erreur
      showErrorPopup: false, // Contrôle l'affichage de la popup d'erreur
      animationStep: 1, // Étape d'animation pour le premier joueur
      animatedRating: 0, // Compteur pour l'animation de la note
      animationFinished: false, // Indique si l'animation est terminée
      otherPlayersVisible: false, // Contrôle l'affichage des autres joueurs
      userCredits: 0, // Crédits de l'utilisateur
    };
  },
  computed: {
    firstPlayer() {
      return this.packData?.players?.[0] || null;
    },
    otherPlayers() {
      return this.packData?.players?.slice(1) || [];
    },
  },
  methods: {
    async fetchPackDetails() {
      try {
        // Récupérer les informations de l'utilisateur depuis localStorage
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || !user.id) {
          throw new Error('Utilisateur non authentifié');
        }

        // Ajouter l'ID utilisateur dans les en-têtes de la requête
        const response = await axios.get(
          `http://127.0.0.1:8000/api/pack/random/${this.packName}`,
          {
            headers: {
              'X-User-Id': user.id,  // Ajouter l'ID utilisateur ici
            },
          }
        );

        this.packData = response.data;
        this.userCredits = response.data.userCredits; // Mettre à jour les crédits de l'utilisateur
        
        // Réinitialisation des étapes d'animation avant de commencer une nouvelle animation
        this.animationStep = 1;
        this.animatedRating = 0;
        this.animationFinished = false;
        this.otherPlayersVisible = false;

        // Démarrer l'animation après avoir chargé les données
        if (this.firstPlayer) {
          this.startAnimation();
        }

      } catch (error) {
        console.error("Error fetching pack details:", error);
        this.error =
          error.response?.data?.error || "Une erreur s'est produite lors de la récupération des données.";
        // Afficher la popup avec l'erreur
        this.showErrorPopup = true;
      } finally {
        this.loading = false;
      }
    },
  

    startAnimation() {
      // Animation étape par étape
      const steps = [
        { delay: 1000, step: 1 }, // Pays
        { delay: 1000, step: 2 }, // Type
        { delay: 1500, step: 3 }, // Compteur de score
        { delay: 2000, step: 4 }, // Nom
      ];

      steps.forEach(({ delay, step }, index) => {
        setTimeout(() => {
          this.animationStep = step;
          if (step === 3) this.animateRating();
          if (index === steps.length - 1) {
            this.animationFinished = true;
            this.revealOtherPlayers();
          }
        }, steps.slice(0, index + 1).reduce((acc, cur) => acc + cur.delay, 0));
      });
    },

    animateRating() {
      const targetRating = this.firstPlayer.rating;
      let currentRating = 0;
      const interval = setInterval(() => {
        if (currentRating >= targetRating) {
          clearInterval(interval);
        } else {
          currentRating += Math.ceil(targetRating / 30); // Incrémente doucement
          this.animatedRating = currentRating > targetRating ? targetRating : currentRating;
        }
      }, 50); // Intervalle de l'animation
    },

    revealOtherPlayers() {
      // Attendre 2 secondes après l'animation pour révéler les autres joueurs
      setTimeout(() => {
        this.otherPlayersVisible = true;
      }, 1000);
    },

    reopenPack() {
      // Réinitialiser l'animation avant de réouvrir un pack
      this.animationStep = 1;
      this.animatedRating = 0;
      this.animationFinished = false;
      this.otherPlayersVisible = false;

      // Rouvrir le pack et relancer l'animation
      this.fetchPackDetails();
    },

    closePopup() {
      this.showErrorPopup = false;
    },
  },
  created() {
    this.fetchPackDetails();
  },
};
</script>

<style scoped>
/* Styles globaux pour améliorer l'apparence */
h1 {
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

/* Carte du premier joueur (limiter la hauteur) */
.bg-white {
  max-height: 400px; /* Limite la hauteur */
  overflow-y: auto; /* Active le défilement si trop de contenu */
}

/* Transition d'animation douce */
.transform {
  transition: transform 0.3s ease;
}

.bg-gradient-to-b {
  background: linear-gradient(180deg, #bbdefb, #81d4fa);
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Boutons */
button, .router-link {
  transition: transform 0.3s ease;
}

button:hover, .router-link:hover {
  transform: scale(1.05);
}

/* Styles de la popup d'erreur */
.fixed {
  z-index: 50;
}
</style>
