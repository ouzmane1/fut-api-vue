<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Register</button>
    </form>
    <div v-if="error">{{ error }}</div>
    <div v-if="success">{{ success }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: '',
      success: ''
    };
  },
  methods: {
    async handleRegister() {
      try {
        const response = await axios.post('http://localhost:8000/api/register', {
          username: this.username,
          password: this.password
        });
        this.success = response.data.message;
        this.error = '';

        // Stocker les informations de l'utilisateur dans localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } catch (error) {
        this.error = error.response.data.message;
        this.success = '';
      }
    }
  }
};
</script>
