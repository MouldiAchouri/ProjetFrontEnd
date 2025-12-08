// Importe la fonction essentielle 'createApp' de Vue, qui est utilisée pour initialiser et configurer l'application.
import { createApp } from 'vue'
// Importe le composant racine de l'application (le point de départ de la hiérarchie des composants).
import App from './App.vue'
// Importe la configuration du routeur (définie dans './router/index.js' ou similaire).
import router from './router' // Importe le routeur que nous venons de définir

// Crée l'instance de l'application Vue en utilisant le composant racine 'App'.
const app = createApp(App)

// Installe le routeur dans l'application, rendant les fonctionnalités de routage disponibles partout.
// Utilise le routeur dans l'application Vue
app.use(router)

// Monte l'application Vue dans l'élément HTML ayant l'ID 'app' (généralement dans index.html).
app.mount('#app')