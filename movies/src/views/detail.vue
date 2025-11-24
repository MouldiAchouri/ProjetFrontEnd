<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
// CRITICAL STEP: Retrieving the ID passed from the router
const imdbID = route.params.id; 

const API_KEY = "4726f8f9";
const BASE_URL = "http://www.omdbapi.com/";

const movie = ref(null);
const isLoading = ref(true);
const error = ref(null);

const fetchMovie = async () => {
  try {
    // Uses the ID to fetch full details (&i=ID)
    const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.Response === "True") movie.value = data;
    else error.value = data.Error;
  } catch (err) {
    error.value = `Erreur inattendue : ${err.message}`;
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchMovie);
</script>

<template>
  <div class="detail-page">
    <button @click="router.back()">⬅ Retour</button>

    <p v-if="isLoading">Chargement...</p>
    <p v-else-if="error">{{ error }}</p>

    <div v-else class="movie-detail">
      <div class="info-block">
        <!-- Display the ID explicitly -->
        <p class="imdb-id"><strong>IMDb ID:</strong> {{ imdbID }}</p>

        <img :src="movie.Poster" :alt="movie.Title" />
      </div>

      <div class="text-block">
        <h1>{{ movie.Title }}</h1>
        <p><strong>Année:</strong> {{ movie.Year }}</p>
        <p><strong>Genre:</strong> {{ movie.Genre }}</p>
        <p><strong>Durée:</strong> {{ movie.Runtime }}</p>
        <p><strong>Acteurs:</strong> {{ movie.Actors }}</p>
        <p><strong>Réalisateur:</strong> {{ movie.Director }}</p>
        <p class="plot"><strong>Résumé:</strong> {{ movie.Plot }}</p>
        <p><strong>IMDB Rating:</strong> ⭐ {{ movie.imdbRating }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-page { padding: 30px; }
.detail-page button { 
    margin-bottom: 30px; 
    padding: 8px 15px; 
    border-radius: 4px;
    background-color: #ecf0f1;
}
.movie-detail { 
    display: flex; 
    gap: 40px; 
    flex-wrap: wrap; 
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}
.info-block {
    flex-shrink: 0;
    text-align: center;
}
.movie-detail img { 
    width: 300px; 
    height: auto;
    border-radius: 8px; 
    object-fit: cover;
}
.imdb-id {
    font-size: 0.9em;
    color: #7f8c8d;
    margin-bottom: 15px;
}
.text-block h1 {
    margin-top: 0;
    font-size: 2.5em;
    border-bottom: 2px solid #bdc3c7;
}
.plot {
    line-height: 1.6;
    margin-top: 20px;
    font-style: italic;
}
</style>