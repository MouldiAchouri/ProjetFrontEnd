import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Importe le routeur que nous venons de définir

const app = createApp(App)

// Utilise le routeur dans l'application Vue
app.use(router)

app.mount('#app')