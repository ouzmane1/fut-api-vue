import { createRouter } from "vue-router"
import { createWebHistory } from "vue-router"


import HomeApi from "@/views/HomeApi.vue"
import PackDetails from "@/views/PackDetails.vue"
import OpenPack from "@/views/OpenPack.vue"
import MyPlayers from "@/views/MyPlayers.vue"
import AllPlayers from "@/views/AllPlayers.vue"
import Register from "@/views/Register.vue"
import Login from "@/views/Login.vue"
import Admin from "@/views/Admin.vue"
// import Pack from "@/views/Pack.vue"
// import SearchPlayer from "@/views/SearchPlayer.vue"
// import MyPlayer from "@/views/MyPlayer.vue"

const routes = [
  {
    path: '/',
    name: "app_home",
    component: HomeApi
  },
  {
    path: '/pack/:title', // Paramètre dynamique pour afficher les détails du pack
    name: 'PackDetails',
    component: PackDetails,
  },
  {
    path: '/open-pack',
    name: 'OpenPack',
    component: OpenPack,
  },
  {
    path: '/consult-my-players',
    name: 'MyPlayers',
    component: MyPlayers,
  },
  {
    path: '/consult-all-players',
    name: 'AllPlayers',
    component: AllPlayers,
  },
  {
    path: "/pack/:title",
    name: "PackDetails",
    component: PackDetails,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('user')); // Récupérer l'utilisateur actuel depuis localStorage

      // Vérifier si l'utilisateur est authentifié et si son rôle est admin
      if (user && user.roles && user.roles.includes('ROLE_ADMIN')) {
        next(); // Si l'utilisateur est admin, il peut accéder à la route
      } else {
        next('/login'); // Sinon, rediriger vers la page de login
      }
    }
  } 

  // {
  //   path: '/pack',
  //   name: "app_pack",
  //   component: Pack
  // },
  // {
  //   path: '/search-player',
  //   name: "app_search_player",
  //   component: SearchPlayer
  // },
  // {
  //   path: '/my-players',
  //   name: "app_my_players",
  //   component: MyPlayer
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
