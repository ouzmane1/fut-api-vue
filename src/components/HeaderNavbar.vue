<template>
  <header class="m-8 mt-5 flex justify-center shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
    <nav class="w-full mx-12 flex flex-row justify-between items-center py-4 px-6">
      <!-- Élément aligné à gauche -->
      <router-link to="/" class="text-3xl font-extrabold text-white hover:text-gray-300 transition duration-300">
        <h1>FUTAPI</h1>
      </router-link>

      <!-- Élément aligné à droite -->
      <div v-if="isAuthenticated" class="flex items-center space-x-6">
        <div class="user-info-box flex flex-col text-right">
          <span class="text-white text-lg font-medium">
            {{ currentUser.username }}
          </span>
          <!-- <span class="text-gray-200 text-sm">
            {{ currentUser.credits }} crédits
          </span> -->
          
        </div>
        <button 
          @click="handleLogout" 
          class="ml-4 text-white bg-red-600 hover:bg-red-500 text-lg px-4 py-2 rounded-lg shadow-md transition duration-300">
          Logout
        </button>
      </div>
      <div v-else class="flex space-x-4">
        <router-link to="/register" class="text-white text-lg bg-blue-400 px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
          Register
        </router-link>
        <router-link to="/login" class="text-white text-lg bg-blue-400 px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
          Login
        </router-link>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const isAuthenticated = ref(false);
const currentUser = ref({});

const handleLogout = async () => {
  try {
    await axios.post('http://localhost:8000/api/logout');
    localStorage.removeItem('user');
    isAuthenticated.value = false;
    currentUser.value = {};
    router.push('/');
  } catch (error) {
    console.error('Error logging out:', error);
  }
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
    console.error('Error fetching current user:', error);
    isAuthenticated.value = false;
    currentUser.value = {};
  }
};

onMounted(() => {
  checkCurrentUser();
});

watch(() => router.currentRoute.value.path, () => {
  checkCurrentUser();
});
</script>
