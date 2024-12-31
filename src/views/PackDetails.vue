<template>
  <div class="bg-gradient-to-b from-blue-100 to-blue-200 min-h-screen flex flex-col items-center py-10">
    <!-- Titre -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-blue-800 uppercase">
        {{ packName }}
      </h1>
      <p class="text-sm text-blue-600">Découvrez les joueurs de votre pack</p>
    </div>

    <!-- Contenu -->
    <div v-if="loading" class="text-center">
      <p class="text-gray-700 text-xl">Chargement des données...</p>
    </div>
    <div v-if="error" class="text-center text-red-500">
      <p>{{ error }}</p>
    </div>

    <!-- Premier joueur avec animation -->
    <div v-if="!loading && !error && firstPlayer" class="w-full max-w-lg mb-10">
      <div class="bg-white rounded-lg shadow-md p-6 relative overflow-hidden">
        <div class="absolute inset-0 flex items-center justify-center" v-if="!animationFinished">
          <!-- Animation : Pays -->
          <p v-if="animationStep === 1" class="text-3xl font-bold text-gray-800">
            {{ firstPlayer.nation }}
          </p>
          <!-- Animation : Type -->
          <p v-else-if="animationStep === 2" class="text-3xl font-bold text-gray-800">
            {{ firstPlayer.type }}
          </p>
          <!-- Animation : Score avec compteur -->
          <p v-else-if="animationStep === 3" class="text-4xl font-bold text-blue-600">
            {{ animatedRating }}
          </p>
          <!-- Animation : Nom -->
          <p v-else-if="animationStep === 4" class="text-2xl font-bold text-gray-800">
            {{ firstPlayer.name }}
          </p>
        </div>
        <!-- Informations après animation -->
        <div v-if="animationFinished" class="text-center">
          <h3 class="text-xl font-bold text-gray-800">{{ firstPlayer.name }}</h3>
          <p class="text-sm text-gray-600">{{ firstPlayer.club }}</p>
          <p class="text-sm text-gray-600">Note : {{ firstPlayer.rating }}</p>
          <p class="text-sm text-gray-600">Prix : {{ firstPlayer.price }} crédits</p>
        </div>
      </div>
    </div>

    <!-- Liste des autres joueurs -->
    <div v-if="!loading && !error && otherPlayersVisible" class="w-full max-w-5xl px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="player in otherPlayers" :key="player.id" class="bg-white rounded-lg shadow-md p-4">
          <h4 class="text-lg font-bold text-gray-800">{{ player.name }}</h4>
          <p class="text-sm text-gray-600">{{ player.club }}</p>
          <p class="text-sm text-gray-600">Nation : {{ player.nation }}</p>
          <p class="text-sm text-gray-600">Note : {{ player.rating }}</p>
          <p class="text-sm text-gray-600">Prix : {{ player.price }} crédits</p>
        </div>
      </div>
    </div>

    <!-- Crédits restants -->
    <div v-if="!loading && !error" class="mt-8 text-center">
      <p class="text-lg font-bold text-blue-600">Crédits restants : {{ userCredits }}</p>
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
      } catch (error) {
        console.error("Error fetching pack details:", error);
        this.error =
          error.response?.data?.error || "Une erreur s'est produite lors de la récupération des données.";
      } finally {
        this.loading = false;
        if (this.firstPlayer) {
          this.startAnimation();
        }
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
  },
  created() {
    this.fetchPackDetails();
  },
};
</script>
