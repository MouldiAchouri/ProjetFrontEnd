<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FilmCard from '../components/FilmCard.vue';

// Clé OMDB API (votre clé)
const API_KEY = "4726f8f9";
const BASE_URL = "http://www.omdbapi.com/";


const searchTerm = ref('');
const films = ref([]);
const isLoading = ref(false);
const error = ref(null);

// Récupère l'instance du routeur pour la navigation
const router = useRouter();

// Fonction de recherche de films
const searchMovies = async () => {
  if (!searchTerm.value.trim()) {
    error.value = "Veuillez entrer un terme de recherche.";
    films.value = [];
    return;
  }

  isLoading.value = true;
  error.value = null;
  films.value = [];

  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&s=${searchTerm.value}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "True") {
      films.value = data.Search;
    } else {
      error.value = data.Error || "Aucun film trouvé pour cette recherche.";
    }
  } catch (err) {
    error.value = `Erreur inattendue : ${err.message}`;
  } finally {
    isLoading.value = false;
  }
};

// Fonction appelée pour déclencher la navigation vers les détails
const goToDetail = (imdbID) => {
  // Navigation CRITIQUE qui a été le point de blocage
  router.push(`/movie/${imdbID}`);
};

// Fonction qui reçoit l'événement 'view-detail' du FilmCard
const handleViewDetail = (imdbID) => {
  goToDetail(imdbID);
};
</script>

<template>
  <div class="home-view">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Recherche de Films OMDb</h1>

    <div class="search-bar">
      <input
          v-model="searchTerm"
          @keyup.enter="searchMovies"
          placeholder="Entrez un titre de film..."
      />
      <button @click="searchMovies" :disabled="isLoading">Rechercher</button>
    </div>

    <p v-if="isLoading" class="text-center text-blue-500 font-semibold mt-4">Chargement...</p>
    <p v-else-if="error" class="error-message">{{ error }}</p>

    <div v-else class="results-grid">
      <FilmCard
          v-for="film in films"
          :key="film.imdbID"
          :film="film"
          @view-detail="handleViewDetail" />
    </div>
  </div>
</template>

<style scoped>
.home-view { padding: 20px; max-width: 1200px; margin: 0 auto; }
.search-bar { display: flex; gap: 10px; margin-bottom: 30px; }
.search-bar input { flex: 1; padding: 12px; font-size: 16px; border: 1px solid #ccc; border-radius: 6px; }
.search-bar button { padding: 12px 20px; font-size: 16px; border: none; border-radius: 6px; background-color: #3498db; color: white; cursor: pointer; transition: background-color 0.2s; }
.search-bar button:hover:not(:disabled) { background-color: #2980b9; }
.search-bar button:disabled { background-color: #bdc3c7; cursor: not-allowed; }

.results-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding-top: 20px;
}
.error-message {
  color: #e74c3c;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
}
/* Le style du bouton de test peut aussi être retiré si vous le souhaitez */
.test-button {
  padding: 15px 30px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}
.test-button:hover { background: #c0392b; }
</style>