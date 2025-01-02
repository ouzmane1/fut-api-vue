<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">Login</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="username" class="input-label">Username:</label>
          <input type="text" id="username" v-model="username" class="input-field" required />
        </div>
        <div class="input-group">
          <label for="password" class="input-label">Password:</label>
          <input type="password" id="password" v-model="password" class="input-field" required />
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">{{ success }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

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
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:8000/api/login', {
          username: this.username,
          password: this.password
        });
        this.success = response.data.message;
        this.error = '';

        // Stocker les informations de l'utilisateur dans localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        this.$router.push('/');
      } catch (error) {
        this.error = error.response.data.message;
        this.success = '';
      }
    }
  }
};
</script>

<style scoped>
/* Container for centering the form */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

/* Card style for the form */
.login-card {
  background: white;
  padding: 30px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

/* Title styling */
.login-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

/* Form styling */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Input group styling */
.input-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* Input label styling */
.input-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

/* Input field styling */
.input-field {
  padding: 12px;
  font-size: 1rem;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border 0.3s;
}

.input-field:focus {
  border-color: #007bff;
  outline: none;
}

/* Button styling */
.login-button {
  background-color: #007bff;
  color: white;
  padding: 12px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #0056b3;
}

/* Message styling */
.error-message {
  color: #d9534f;
  margin-top: 15px;
}

.success-message {
  color: #5bc0de;
  margin-top: 15px;
}
</style>
