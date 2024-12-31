<template>
  <header class="m-8 mt-5 flex justify-center">
    <nav class="w-full mx-12 flex flex-row justify-between items-center">
      <!-- Élément aligné à gauche -->
      <router-link to="/" class="text-xl font-bold text-gray-800">
        <h1>FUTAPI</h1>
      </router-link>

      <!-- Élément aligné à droite -->
      <div v-if="isAuthenticated">
        <span class="text-gray-800 text-xl">{{ currentUser.username }}</span>
        <button @click="handleLogout" class="ml-4 text-gray-800 text-xl cursor-pointer">
          Logout
        </button>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isAuthenticated = ref(false)
const currentUser = ref({})

const handleLogout = async () => {
  try {
    await axios.post('http://localhost:8000/api/logout')
    localStorage.removeItem('user_id')
    localStorage.removeItem('username')
    isAuthenticated.value = false
    currentUser.value = {}
    router.push('/')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}

const checkCurrentUser = () => {
  const userId = localStorage.getItem('user_id')
  const username = localStorage.getItem('username')
  if (userId && username) {
    isAuthenticated.value = true
    currentUser.value = { id: userId, username }
  }
}

onMounted(() => {
  checkCurrentUser()
})
</script>

<style scoped>
/* Si vous voulez ajouter un style supplémentaire (optionnel) */
</style>
