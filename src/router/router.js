import { createRouter } from "vue-router"
import { createWebHistory } from "vue-router"


import HomeApi from "@/views/HomeApi.vue"
import PackDetails from "@/views/PackDetails.vue"
import OpenPack from "@/views/OpenPack.vue"
import MyPlayers from "@/views/MyPlayers.vue"
import AllPlayers from "@/views/AllPlayers.vue"
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
