<template>
  <div class="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start">
    <div 
      v-if="isAuthenticated" 
      class="credit-box flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg shadow-lg px-8 py-4 mt-6"
    >
      <img src="/Users/ik/Documents/EFREI/fut-api-vue/public/img/credits.webp" alt="Credits" class="credit-icon mr-2 w-25 h-12" />      
      <span class="text-lg ml-2">Vous avez</span>
      <span class="text-3xl ml-2 mr-2">{{ currentUser.credits }}</span>
      <span class="text-lg">crédits disponibles</span>
    </div>
    <div v-else class="text-center text-gray-400 mt-6">
      <p>Veuillez vous connecter pour consulter vos crédits.</p>
    </div>
    <!-- Conteneur des cartes -->
    <div class="mt-48 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 w-full max-w-screen-xl">
      <!-- Première carte -->
      <div class="card">
        <img src="/Users/ik/Documents/EFREI/fut-api-vue/public/img/bronze.png" alt="bronze" class="" />
        <div class="card-content">
          <h2 class="card-title">Pack Bronze</h2>
          <p class="card-price">400 crédits</p>
          <button
            class="card-button"
            
            @click="handleCardClick('Bronze')"
          >
            Acheter
          </button>
        </div>
      </div>

      <!-- Deuxième carte -->
      <div class="card">
        <img src="/Users/ik/Documents/EFREI/fut-api-vue/public/img/silver.png" alt="argent" class="" />
        <div class="card-content">
          <h2 class="card-title">Pack Argent</h2>
          <p class="card-price">800 crédits</p>
          <button
            class="card-button"
            
            @click="handleCardClick('Silver')"
          >
            Acheter
          </button>
        </div>
      </div>

      <!-- Troisième carte -->
      <div class="card">
        <img src="/Users/ik/Documents/EFREI/fut-api-vue/public/img/gold.png" alt="or" class="" />
        <div class="card-content">
          <h2 class="card-title">Pack Or</h2>
          <p class="card-price">1200 crédits</p>
          <button
            class="card-button"
            
            @click="handleCardClick('Gold')"
          >
            Acheter
          </button>
        </div>
      </div>

      <!-- Quatrième carte -->
      <div class="card">
        <img src="/Users/ik/Documents/EFREI/fut-api-vue/public/img/icon.png" alt="icon" class="" />
        <div class="card-content">
          <h2 class="card-title">Pack Icon</h2>
          <p class="card-price">2000 crédits</p>
          <button
            class="card-button"
            
            @click="handleCardClick('Icon')"
          >
            Acheter
          </button>
        </div>
      </div>
    </div>

    <!-- Popup Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">Authentification requise</h3>
        <p class="modal-message">Vous devez vous inscrire ou vous connecter pour acheter un pack.</p>
        <button class="modal-button" @click="closeModal">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const isAuthenticated = ref(false);
const currentUser = ref({});
const showModal = ref(false);

const handleCardClick = (packType) => {
  if (!isAuthenticated.value) {
    showModal.value = true;
  } else {
    router.push({ name: "PackDetails", params: { title: packType } });
  }
};

const closeModal = () => {
  showModal.value = false;
};

const checkCurrentUser = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.id) {
      throw new Error('Utilisateur non authentifié');
    }

    const response = await axios.get(`http://localhost:8000/api/users/${user.id}`);
    currentUser.value = response.data;
    isAuthenticated.value = true;
  } catch (error) {
    console.error('Erreur lors de la récupération de l’utilisateur :', error);
    isAuthenticated.value = false;
    currentUser.value = {};
  }
};

onMounted(() => {
  checkCurrentUser();
});
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

.credit-box {
  background: linear-gradient(90deg, #22c55e, #3b82f6);
  color: white;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.35);
  }
}
</style>
