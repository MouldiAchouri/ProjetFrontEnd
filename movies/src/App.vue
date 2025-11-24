<script setup>
// Importation de "ref" depuis Vue pour créer des variables réactives
import { ref } from 'vue';

<<<<<<< HEAD

// poser la clé personnel OMdb ici
=======
// --- Configuration ---
// Déclaration de la clé API qui servira pour accéder à OMDb
>>>>>>> ef0ceaede2da25a66c98af078701424587ffd681
const API_KEY = "4726f8f9"; 
// URL de base de l’API OMDb
const BASE_URL = "http://www.omdbapi.com/";

<<<<<<< HEAD
const searchTerm = ref('');     // Recherche
const films = ref([]);          // Liste les résultats
const isLoading = ref(false);   // chargement des résultats
const error = ref(null);        // gestion des erreurs

// moteur de recherche
=======
// --- État de l'application (Variables réactives) ---
// Variable réactive qui contient le texte tapé par l’utilisateur
const searchTerm = ref('');     
// Liste réactive qui contiendra les films trouvés
const films = ref([]);          
// Variable indiquant si une recherche est en cours
const isLoading = ref(false);   
// Variable réactive qui stocke un message d’erreur éventuel
const error = ref(null);        

// --- Implémentation du moteur de recherche ---
// Fonction async qui lance une recherche de films sur OMDb
>>>>>>> ef0ceaede2da25a66c98af078701424587ffd681
const searchMovies = async () => {
    // On réinitialise le message d’erreur
    error.value = null;
    // On vide la liste des films
    films.value = [];
    
<<<<<<< HEAD
    // si on recherche sans valeur dans la barre de recherche, affiche une erreur
=======
    // Vérifie que l’utilisateur a bien entré un terme de recherche
>>>>>>> ef0ceaede2da25a66c98af078701424587ffd681
    if (!searchTerm.value) {
        // Message d’erreur si l’entrée est vide
        error.value = "Veuillez entrer un terme de recherche.";
        return;
    }

<<<<<<< HEAD

    isLoading.value = true; // lorsqu'on recherche, affiche le "chargement"
=======
    // Indique que la recherche commence
    isLoading.value = true; 
>>>>>>> ef0ceaede2da25a66c98af078701424587ffd681

    try {
        // Encode le texte pour qu'il soit sûr dans l’URL
        const encodedSearchTerm = encodeURIComponent(searchTerm.value);
        // Construit l’URL de l’API avec la clé et le paramètre "s" (search)
        const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodedSearchTerm}`; 

        // Appelle l’API avec fetch
        const response = await fetch(url);
        
        // Vérifie si la réponse réseau est correcte
        if (!response.ok) {
            throw new Error(`Erreur réseau : ${response.status}`);
        }

        // Convertit la réponse JSON en objet utilisable
        const data = await response.json();

        // Si l’API a trouvé des résultats
        if (data.Response === "True") {
            // On met à jour la liste des films
            films.value = data.Search;
        } else {
            // Si OMDb renvoie une erreur ou aucun résultat
            error.value = data.Error || `Aucun résultat trouvé pour "${searchTerm.value}".`;
            films.value = [];
        }

    } catch (err) {
        // Message générique en cas d’erreur imprévue
        error.value = `Une erreur inattendue s'est produite : ${err.message}`;
    } finally {
        // La recherche est terminée, on désactive l’indicateur de chargement
        isLoading.value = false; 
    }
};
</script>

<template>
  <!-- Conteneur principal de l’application -->
  <div class="movie-search-app">

    <!-- En-tête avec le titre et la barre de recherche -->
    <header>
      <h1>OMDb Vue Search</h1>

      <!-- Zone de saisie + bouton -->
      <div class="search-bar">
        <!-- Champ de texte lié à searchTerm, lance une recherche quand on appuie Entrée -->
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Entrez un titre de film..."
          @keyup.enter="searchMovies"
        >
        <!-- Bouton qui déclenche la recherche, désactivé si isLoading est vrai -->
        <button @click="searchMovies" :disabled="isLoading">
          Rechercher
        </button>
      </div>
    </header>

    <main>
      <!-- Message affiché si la recherche est en cours -->
      <p v-if="isLoading" class="loading-message">
        Chargement des films...
      </p>

      <!-- Message affiché si une erreur a été définie -->
      <p v-else-if="error" class="error-message">
        Erreur : {{ error }}
      </p>

      <!-- Zone des résultats affichée s’il n’y a pas d’erreur -->
      <div v-else class="results-grid">

        <!-- Message si aucun film trouvé mais qu’un terme existe -->
        <p v-if="films.length === 0 && searchTerm">
            Aucun film trouvé pour cette recherche.
        </p>
        
        <!-- Boucle qui affiche chaque film sous forme de carte -->
        <div v-for="film in films" :key="film.imdbID" class="film-card">

          <!-- Affiche l’affiche du film, ou une image par défaut si absente -->
          <img 
            :src="film.Poster !== 'N/A' ? film.Poster : 'https://via.placeholder.com/300x450?text=Pas+dAffiche'" 
            :alt="film.Title"
          >

          <!-- Informations sur le film -->
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
/* Conteneur général de l'app */
.movie-search-app {
    font-family: sans-serif;
    padding: 20px;
}

/* Zone de recherche */
.search-bar {
    margin-bottom: 30px;
}

/* Style des inputs et boutons */
.search-bar input, .search-bar button {
    padding: 10px;
    font-size: 16px;
}

/* Grille des résultats */
.results-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

/* Carte de film */
.film-card {
    width: 200px;
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
}

/* Image du film */
.film-card img {
    width: 100%;
    height: auto;
    display: block;
    margin-bottom: 10px;
}

/* Message d’erreur */
.error-message {
    color: red;
}
</style>
