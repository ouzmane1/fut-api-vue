// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/router'

// Tailwind
import './assets/styles/tailwind.css'

// Fontawesome
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { fab } from "@fortawesome/free-brands-svg-icons"

// Configuration de Fontawesome
library.add(fas, fab)

// Création de l'application
const app = createApp(App)

// Plugins
app.use(router)
app.use(createPinia())

// Composants globaux
app.component("font-awesome-icon", FontAwesomeIcon)

// Montage de l'application
app.mount('#app')