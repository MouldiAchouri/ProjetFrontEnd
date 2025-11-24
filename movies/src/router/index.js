import { createRouter, createWebHistory } from 'vue-router';

// Import the views 
import Home from '../views/home.vue';
import Detail from '../views/detail.vue';

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: Home 
  },
  { 
    // This dynamic path captures the ID and saves it as route.params.id
    path: '/movie/:id', 
    name: 'Detail', 
    component: Detail,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;