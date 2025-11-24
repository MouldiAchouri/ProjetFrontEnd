<script setup>
import { ref } from 'vue';


// poser la clé personnel OMdb ici
const API_KEY = "4726f8f9"; 
const BASE_URL = "http://www.omdbapi.com/";

const searchTerm = ref('');     // Recherche
const films = ref([]);          // Liste les résultats
const isLoading = ref(false);   // chargement des résultats
const error = ref(null);        // gestion des erreurs

// moteur de recherche
const searchMovies = async () => {
    error.value = null;
    films.value = [];
    
    // si on recherche sans valeur dans la barre de recherche, affiche une erreur
    if (!searchTerm.value) {
        error.value = "Veuillez entrer un terme de recherche.";
        return;
    }


    isLoading.value = true; // lorsqu'on recherche, affiche le "chargement"

    try {
        const encodedSearchTerm = encodeURIComponent(searchTerm.value);
        // Paramètre 's' pour la recherche de liste
        const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodedSearchTerm}`; 

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erreur réseau : ${response.status}`);
        }

        const data = await response.json();

        if (data.Response === "True") {
            films.value = data.Search;
        } else {
            // Cas où OMDb ne trouve rien ou renvoie une erreur spécifique (ex: clé invalide)
            error.value = data.Error || `Aucun résultat trouvé pour "${searchTerm.value}".`;
            films.value = [];
        }

    } catch (err) {
        error.value = `Une erreur inattendue s'est produite : ${err.message}`;
    } finally {
        isLoading.value = false; // Fin du chargement
    }
};
</script>

<template>
  <div class="movie-search-app">
    <header>
      <h1>OMDb Vue Search</h1>
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Entrez un titre de film..."
          @keyup.enter="searchMovies"
        >
        <button @click="searchMovies" :disabled="isLoading">
          Rechercher
        </button>
      </div>
    </header>

    <main>
      <p v-if="isLoading" class="loading-message">
        Chargement des films...
      </p>

      <p v-else-if="error" class="error-message">
        Erreur : {{ error }}
      </p>

      <div v-else class="results-grid">
        <p v-if="films.length === 0 && searchTerm">
            Aucun film trouvé pour cette recherche.
        </p>
        
        <div v-for="film in films" :key="film.imdbID" class="film-card">
          <img 
            :src="film.Poster !== 'N/A' ? film.Poster : 'https://via.placeholder.com/300x450?text=Pas+dAffiche'" 
            :alt="film.Title"
          >
          <div class="film-info">
            <h3>{{ film.Title }}</h3>
            <p>{{ film.Year }} - {{ film.Type }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
/* Vous pouvez ajouter votre CSS ici. 
  Exemple de style minimal pour les cartes :
*/
.movie-search-app {
    font-family: sans-serif;
    padding: 20px;
}
.search-bar {
    margin-bottom: 30px;
}
.search-bar input, .search-bar button {
    padding: 10px;
    font-size: 16px;
}
.results-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}
.film-card {
    width: 200px;
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
}
.film-card img {
    width: 100%;
    height: auto;
    display: block;
    margin-bottom: 10px;
}
.error-message {
    color: red;
}
</style>