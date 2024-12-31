// src/stores/user.js
import { defineStore } from 'pinia'
import axios from '@/plugins/axios' // Utilisation de votre fichier centralisé

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user
  },
  
  actions: {
    async checkCurrentUser() {
      try {
        const response = await axios.get('/user/current') // Plus besoin de répéter la baseURL
        if (response.data.status === 'success') {
          this.user = response.data.user
        } else {
          this.user = null
        }
      } catch (error) {
        console.error('Erreur:', error)
        this.user = null
      }
    },

    async login(credentials) {
      try {
        const response = await fetch('http://localhost:8000/api/login', { // Assurez-vous que l'URL est correcte
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })
        
        if (!response.ok) {
          throw new Error('Erreur réseau lors de la connexion.')
        }
    
        const data = await response.json()
    
        if (data.status === 'success') {
          await this.checkCurrentUser()
          return true
        }
        return false
      } catch (error) {
        console.error('Erreur de connexion:', error)
        return false
      }
    },

    async logout() {
      try {
        await axios.post('/logout') // BaseURL déjà incluse
        this.user = null
        return true
      } catch (error) {
        console.error('Erreur de déconnexion:', error)
        return false
      }
    }
  }
})
