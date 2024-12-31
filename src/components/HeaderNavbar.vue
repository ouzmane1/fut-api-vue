<template>
  <header class="m-8 mt-5 flex justify-center">
    <nav class="w-full mx-12 flex flex-row justify-between items-center">
      <!-- Élément aligné à gauche -->
      <router-link to="/" class="text-xl font-bold text-gray-800">
        <h1>FUTAPI</h1>
      </router-link>

      <!-- Élément aligné à droite -->
      <div v-if="isAuthenticated">
        <div v-if="isAuthenticated" class="flex items-center">
        <div class="user-info-box">
          <span class="text-gray-800 text-xl">{{ currentUser.username }}</span>
          <span class="text-gray-800 text-xl">{{ currentUser.credit }} crédits</span>
        </div>
        <button @click="handleLogout" class="ml-4 text-gray-800 text-xl cursor-pointer">
          Logout
        </button>
      </div>
      </div>
      <div v-else>
        <router-link to="/register" class="text-gray-800 text-xl cursor-pointer">
          Register
        </router-link>
        <router-link to="/login" class="ml-4 text-gray-800 text-xl cursor-pointer">
          Login
        </router-link>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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

const checkCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.id) {
    isAuthenticated.value = true;
    currentUser.value = user;
  }
};

onMounted(() => {
  checkCurrentUser();
});
</script>

<style scoped>
.user-info-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  border: 2px solid #007bff;
  border-radius: 10px;
  background-color: #e9f5ff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-right: 10px;
}

.user-info-box span {
  margin: 4px 0;
  font-weight: bold;
}

.user-info-box span:first-child {
  color: #007bff;
}

.user-info-box span:last-child {
  color: #28a745;
}
</style>
