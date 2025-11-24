<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const API_KEY = "4726f8f9";
const BASE_URL = "http://www.omdbapi.com/";

const searchTerm = ref('');
const films = ref([]);
const isLoading = ref(false);
const error = ref(null);

const router = useRouter();

const searchMovies = async () => {
  error.value = null;
  films.value = [];
  if (!searchTerm.value) {
    error.value = "Veuillez entrer un terme de recherche.";
    return;
  }
  isLoading.value = true;

  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm.value)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.Response === "True") {
      films.value = data.Search;
    } else {
      error.value = data.Error || `Aucun résultat trouvé pour "${searchTerm.value}".`;
    }
  } catch (err) {
    error.value = `Erreur inattendue : ${err.message}`;
  } finally {
    isLoading.value = false;
  }
};

const goToDetail = (imdbID) => {
  // CRITICAL STEP: Pushes the unique ID into the dynamic route /movie/:id
  router.push(`/movie/${imdbID}`); 
};
</script>

<template>
  <div class="home-view">
    <h1>OMDb Vue Search</h1>

    <div class="search-bar">
      <input
        v-model="searchTerm"
        @keyup.enter="searchMovies"
        placeholder="Entrez un titre de film..."
      />
      <button @click="searchMovies" :disabled="isLoading">Rechercher</button>
    </div>

    <p v-if="isLoading">Chargement...</p>
    <p v-else-if="error" class="error-message">{{ error }}</p>

    <div class="results-grid">
      <div
        v-for="film in films"
        :key="film.imdbID"
        class="film-card"
        @click="goToDetail(film.imdbID)" 
        style="cursor: pointer;"
      >
        <img
          :src="film.Poster !== 'N/A' ? film.Poster : 'https://placehold.co/300x450/cccccc/333333?text=Pas+dAffiche'"
          :alt="film.Title"
        />
        <h3>{{ film.Title }}</h3>
        <p>{{ film.Year }} - {{ film.Type }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view { padding: 20px; }
.search-bar { display: flex; gap: 10px; margin-bottom: 20px; }
.search-bar input { flex: 1; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; }
.search-bar button { padding: 10px 20px; font-size: 16px; border: none; border-radius: 4px; background-color: #3498db; color: white; cursor: pointer; }
.results-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
.film-card { 
    width: 200px; 
    border: 1px solid #ddd; 
    padding: 10px; 
    border-radius: 8px; 
    text-align: center; 
    transition: transform 0.2s, box-shadow 0.2s; 
    background-color: white;
}
.film-card:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.1); }
.film-card img { width: 100%; height: auto; border-radius: 4px; }
.error-message { color: #e74c3c; font-weight: bold; }
</style>