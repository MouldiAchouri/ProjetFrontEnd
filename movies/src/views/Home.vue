<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import FilmCard from '../components/FilmCard.vue';
  
  // Clé OMDB API.
  const API_KEY = "4726f8f9";
  // URL de base de l'API.
  const BASE_URL = "http://www.omdbapi.com/";
  
  
  // Variable réactive pour le terme de recherche (saisie utilisateur).
  const searchTerm = ref('');
  // Tableau pour stocker les résultats de films.
  const films = ref([]);
  // État de chargement (désactive les interactions pendant la requête).
  const isLoading = ref(false);
  // Message d'erreur.
  const error = ref(null);
  
  // Récupère l'instance du routeur pour la navigation.
  const router = useRouter();
  
  // Fonction asynchrone pour la recherche de films.
  const searchMovies = async () => {
    // Vérification si le champ est vide.
    if (!searchTerm.value.trim()) {
      error.value = "Veuillez entrer un terme de recherche.";
      films.value = [];
      return;
    }
  
    isLoading.value = true;
    error.value = null;
    films.value = [];
  
    try {
      // Construction de l'URL pour la recherche (paramètre 's').
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
  
  // Fonction de navigation vers la page de détails.
  const goToDetail = (imdbID) => {
    // Navigue vers la route '/movie/ID_IMDB'.
    router.push(`/movie/${imdbID}`);
  };
  
  // Gère l'événement 'view-detail' émis par FilmCard.
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
  
  /* Style par défaut (Grand écran) : Flexbox horizontal (input et button côte à côte). */
  .search-bar { 
      display: flex; 
      gap: 10px; 
      margin-bottom: 30px; 
  }
  /* Le champ de saisie prend la majeure partie de l'espace horizontal. */
  .search-bar input { flex: 1; padding: 12px; font-size: 16px; border: 1px solid #ccc; border-radius: 6px; }
  
  /* Styles du bouton (couleurs, padding, etc.). */
  .search-bar button { padding: 12px 20px; font-size: 16px; border: none; border-radius: 6px; background-color: #3498db; color: white; cursor: pointer; transition: background-color 0.2s; }
  .search-bar button:hover:not(:disabled) { background-color: #2980b9; }
  .search-bar button:disabled { background-color: #bdc3c7; cursor: not-allowed; }
  
  /* Style de la grille des résultats. */
  .results-grid {
    display: flex;
    flex-wrap: wrap; /* Permet aux cartes de passer à la ligne. */
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
  
  /* ⭐️ RESPONSIVE : Media Query pour les petits écrans (smartphones) ⭐️ */
  @media (max-width: 600px) {
      /* Change la direction de Flexbox : empile les éléments verticalement. */
      .search-bar {
          flex-direction: column;
          gap: 15px; /* Augmente l'espace entre le champ et le bouton empilés. */
      }
      
      /* Le bouton et le champ prennent désormais toute la largeur disponible par défaut. */
      .search-bar button, .search-bar input {
          width: 100%;
      }
  }
  </style>