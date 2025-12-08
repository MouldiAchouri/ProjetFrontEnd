<script setup>
  // Importe la fonction 'ref' pour créer des variables réactives.
  import { ref } from 'vue';
  // Importe 'useRouter' pour accéder aux fonctionnalités de navigation du routeur.
  import { useRouter } from 'vue-router';
  // Importe le composant 'FilmCard' qui sera utilisé pour afficher chaque résultat de recherche.
  import FilmCard from '../components/FilmCard.vue';
  
  // Déclaration de la clé OMDB API.
  // Clé OMDB API (votre clé)
  const API_KEY = "4726f8f9";
  // Déclaration de l'URL de base de l'API OMDB.
  const BASE_URL = "http://www.omdbapi.com/";
  
  
  // Variable réactive pour stocker le terme de recherche entré par l'utilisateur (initialisé à vide).
  const searchTerm = ref('');
  // Variable réactive pour stocker le tableau des résultats de la recherche de films.
  const films = ref([]);
  // Variable réactive pour indiquer l'état de chargement (désactive le bouton si vrai).
  const isLoading = ref(false);
  // Variable réactive pour stocker tout message d'erreur.
  const error = ref(null);
  
  // Initialise l'instance du routeur pour permettre la navigation programmatique.
  // Récupère l'instance du routeur pour la navigation
  const router = useRouter();
  
  // Fonction asynchrone pour effectuer la recherche de films via l'API OMDB.
  // Fonction de recherche de films
  const searchMovies = async () => {
    // Vérifie si le champ de recherche est vide après avoir retiré les espaces.
    if (!searchTerm.value.trim()) {
      // Définit un message d'erreur et vide les résultats.
      error.value = "Veuillez entrer un terme de recherche.";
      films.value = [];
      return; // Arrête l'exécution de la fonction.
    }
  
    // Active l'état de chargement.
    isLoading.value = true;
    // Réinitialise l'erreur et les anciens films.
    error.value = null;
    films.value = [];
  
    // Début du bloc de gestion des erreurs (try...catch).
    // on ajoute la clé pour récupérer la bd dans l'API
    try {
      // Construit l'URL de l'API pour la recherche (paramètre 's').
      const url = `${BASE_URL}?apikey=${API_KEY}&s=${searchTerm.value}`;
      // Envoie la requête HTTP.
      const res = await fetch(url);
      // Parse la réponse en objet JavaScript.
      const data = await res.json();
  
      // Vérifie si la réponse de l'API est positive ("True").
      if (data.Response === "True") {
        // Stocke le tableau des résultats de la recherche.
        films.value = data.Search;
      } else {
        // Stocke le message d'erreur fourni par l'API ou un message par défaut.
        error.value = data.Error || "Aucun film trouvé pour cette recherche.";
      }
    } catch (err) {
      // Capture les erreurs réseau ou de requête.
      error.value = `Erreur inattendue : ${err.message}`;
    } finally {
      // Désactive l'état de chargement, que la requête ait réussi ou échoué.
      isLoading.value = false;
    }
  };
  
  // Fonction qui déclenche la navigation vers le composant de détails du film.
  // Fonction appelée pour déclencher la navigation vers les détails. On récupère les IDs des films
  const goToDetail = (imdbID) => {
    // Utilise le routeur pour changer d'URL vers la route de détail (/movie/:id).
    router.push(`/movie/${imdbID}`);
  };
  
  // Fonction appelée par le composant enfant (FilmCard) lors d'un clic.
  // Fonction qui est appelé lors d'un clique sur une carte d'un film
  const handleViewDetail = (imdbID) => {
    // Appelle la fonction de navigation avec l'ID reçu.
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
  /* Début des styles CSS spécifiques à ce composant. */
  /* Style général de la vue. */
  .home-view { padding: 20px; max-width: 1200px; margin: 0 auto; }
  /* Style de la barre de recherche (utilise Flexbox). */
  .search-bar { display: flex; gap: 10px; margin-bottom: 30px; }
  /* Style du champ de saisie. */
  .search-bar input { flex: 1; padding: 12px; font-size: 16px; border: 1px solid #ccc; border-radius: 6px; }
  /* Style du bouton de recherche. */
  .search-bar button { padding: 12px 20px; font-size: 16px; border: none; border-radius: 6px; background-color: #3498db; color: white; cursor: pointer; transition: background-color 0.2s; }
  /* Effet de survol du bouton lorsqu'il n'est pas désactivé. */
  .search-bar button:hover:not(:disabled) { background-color: #2980b9; }
  /* Style du bouton lorsqu'il est désactivé. */
  .search-bar button:disabled { background-color: #bdc3c7; cursor: not-allowed; }
  
  /* Style de la grille des résultats. */
  .results-grid {
    /* Utilise Flexbox pour la grille. */
    display: flex;
    /* Permet aux éléments de passer à la ligne inférieure si l'espace est insuffisant. */
    flex-wrap: wrap;
    /* Espacement entre les cartes. */
    gap: 20px;
    /* Centre les cartes horizontalement. */
    justify-content: center;
    padding-top: 20px;
  }
  /* wrap = va en dessous si y'a plus de place horizontalement*/
  
  /* Style du message d'erreur. */
  /* message d'erreur */
  .error-message {
    color: #e74c3c;
    font-weight: bold;
    text-align: center;
    margin-top: 20px;
  }
  </style>