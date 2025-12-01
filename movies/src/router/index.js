import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue' // CORRECTION DE CHEMIN : '../' est nécessaire
import Detail from '../views/Detail.vue' // CORRECTION DE CHEMIN : '../' est nécessaire

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
        }
    ]
})

export default router