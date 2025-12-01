import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue' // CORRECTION DE CHEMIN : '../' est nécessaire
import Detail from '../views/Detail.vue' // CORRECTION DE CHEMIN : '../' est nécessaire

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            // Définit la route pour la page de détails qui capture l'ID (tt...)
            path: '/movie/:id',
            name: 'detail',
            component: Detail
        }
    ]
})

export default router