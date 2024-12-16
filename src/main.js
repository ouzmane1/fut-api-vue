
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
// Tailwind
import './assets/styles/tailwind.css'
// Fontawesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { fas } from "@fortawesome/free-solid-svg-icons"; // Tous les icônes "solid"
import { fab } from "@fortawesome/free-brands-svg-icons"; // Tous les icônes "brands"

// Ajout des icônes dans la librairie
library.add(fas, fab);

createApp(App).use(router).component("font-awesome-icon", FontAwesomeIcon).mount('#app')
