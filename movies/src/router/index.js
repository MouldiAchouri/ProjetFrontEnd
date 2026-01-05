import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue' 
import Detail from '../views/Detail.vue' 
import FavorisView from '../components/favoris.vue'
import HistoriqueView from '../components/history.vue'

// utilise des adresses normales. Sans # dans l'URL
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            // Définit la route pour la page de détails qui capture l'ID
            path: '/movie/:id',
            name: 'detail',
            component: Detail
        },
        {
            path: '/favoris', 
            name: 'favoris',
            component: FavorisView
        },
        {
            path: '/historique', 
            name: 'historique',
            component: HistoriqueView
        }
    ]
})

export default router