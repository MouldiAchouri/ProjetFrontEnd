import { createRouter, createWebHistory } from 'vue-router';
// On importe les vues que vous avez créées
import Home from '../views/home.vue'; 
import Detail from '../views/detail.vue';

const routes = [
  // Route pour la page de recherche/accueil
  { 
    path: '/', 
    name: 'Home', 
    component: Home 
  },
  // Route pour la vue détail. ":id" est le paramètre dynamique 
  // qui correspond à l'imdbID du film (ex: /movie/tt0076759)
  { 
    path: '/movie/:id', 
    name: 'Detail', 
    component: Detail 
  },
];

const router = createRouter({
  // Utilise l'historique du navigateur
  history: createWebHistory(), 
  routes,
});

export default router;