<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const props = defineProps({
  text: {
    type: String,
    default: '← Retour',
  },
});

const goBack = () => {
  if (window.history.state.back) {
    router.back();
  } else {
    router.push('/'); // Retour à l'accueil par défaut si pas d'historique
  }
};
</script>

<template>
  <button @click="router.back()" class="back-button">
    {{ text }}
  </button>
</template>

<style scoped>
.back-button {
  margin-bottom: 25px; /* Espace sous le bouton */
  padding: 10px 15px;
  background-color: #3498db; /* Un bleu simple pour l'action */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.2s, transform 0.1s;
  display: inline-flex; /* Assure que le bouton reste centré ou aligné */
  align-items: center;
  text-decoration: none;
}

.back-button:hover {
  background-color: #2980b9;
}

.back-button:active {
  transform: scale(0.98);
}

/* ⭐️ Réactivité ⭐️ */
@media (max-width: 600px) {
  .back-button {
    width: 100%; /* Pleine largeur sur mobile */
    justify-content: center;
    margin-bottom: 20px;
  }
}
</style>