<script setup>
  // Importe la fonction 'ref' pour créer des variables réactives.
  // Importe la fonction 'watch' pour réagir aux changements de l'URL (le correctif clé).
  import { ref, watch } from 'vue';
  // Importe 'useRoute' pour accéder aux paramètres de l'URL.
  // Importe 'useRouter' pour gérer la navigation (router.back()).
  import { useRoute, useRouter } from 'vue-router';
  
  // Définit la clé d'API pour l'accès à OMDB.
  const API_KEY = "4726f8f9";
  // Définit l'URL de base de l'API OMDB.
  const BASE_URL = "http://www.omdbapi.com/";
  
  // Initialise l'objet 'route' pour accéder aux paramètres actuels de l'URL.
  const route = useRoute();
  // Initialise l'objet 'router' pour la navigation.
  const router = useRouter();
  // Variable réactive pour stocker les détails complets du film.
  const filmDetail = ref(null);
  // Variable réactive pour gérer l'état de chargement.
  const isLoading = ref(true);
  // Variable réactive pour stocker les messages d'erreur.
  const error = ref(null);
  
  
  // Définition de la fonction asynchrone pour récupérer les détails d'un film par son ID.
  const fetchFilmDetail = async (imdbID) => {
    // Met l'état de chargement à vrai.
    isLoading.value = true;
    // Réinitialise le message d'erreur.
    error.value = null;
  
    try {
      // Construit l'URL de requête en utilisant l'ID (i) et demandant l'intrigue complète (plot=full).
      const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;
      // Exécute la requête HTTP.
      const res = await fetch(url);
      // Analyse la réponse au format JSON.
      const data = await res.json();
  
      // Vérifie si l'API a répondu positivement.
      if (data.Response === "True") {
        // Stocke les données du film.
        filmDetail.value = data;
      } else {
        // Stocke l'erreur de l'API ou un message par défaut.
        error.value = data.Error || "Détails du film introuvables.";
      }
    } catch (err) {
      // Capture et stocke les erreurs de connexion ou de requête.
      error.value = `Erreur lors du chargement des détails : ${err.message}`;
    } finally {
      // Met l'état de chargement à faux, quelle que soit l'issue.
      isLoading.value = false;
    }
  };
  
  // DÉTECTION DE CHANGEMENT D'URL (Le Correctif Clé) :
  // Surveille le paramètre d'ID de l'URL pour recharger le film lorsque l'utilisateur clique sur un autre film.
  watch(
    // Source à surveiller : la valeur du paramètre 'id' dans l'URL.
    () => route.params.id, 
    // Fonction de rappel qui s'exécute lorsque l'ID change (ou au montage).
    (newID) => {
      // Vérifie si l'ID est présent.
      if (newID) {
        // Lance la récupération des données avec le nouvel ID.
        fetchFilmDetail(newID);
      } else {
        // Affiche une erreur si l'ID est manquant dans l'URL.
        error.value = "Erreur : ID du film manquant dans l'URL.";
        isLoading.value = false;
      }
    },
    // Option: Exécute le 'watch' immédiatement lors du montage initial du composant.
    { immediate: true }
  );
  
  // URL de l'image de substitution.
  const placeholderImage = 'https://placehold.co/300x450/cccccc/333333?text=Pas+d Affiche';
</script>
  
<template>
    <div class="detail-view">
      <button @click="router.back()" class="back-button">← Retour à la recherche</button>
  
      <p v-if="isLoading" class="loading-message">Chargement des détails...</p>
      <p v-else-if="error" class="error-message">Erreur : {{ error }}</p>
  
      <div v-else-if="filmDetail" class="film-details-container">
        <div class="poster-section">
          <img
              :src="filmDetail.Poster !== 'N/A' ? filmDetail.Poster : placeholderImage"
              :alt="filmDetail.Title"
          />
        </div>
        <div class="info-section">
          <h1 class="title">{{ filmDetail.Title }} <span class="year">({{ filmDetail.Year }})</span></h1>
          <p class="plot">{{ filmDetail.Plot }}</p>
  
          <div class="key-info">
            <p><strong>Genre :</strong> {{ filmDetail.Genre }}</p>
            <p><strong>Réalisateur :</strong> {{ filmDetail.Director }}</p>
            <p><strong>Acteurs :</strong> {{ filmDetail.Actors }}</p>
            <p><strong>Durée :</strong> {{ filmDetail.Runtime }}</p>
            <p><strong>Note IMDb :</strong> {{ filmDetail.imdbRating }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* Début des styles CSS spécifiques à ce composant. */
  /* Style de la vue principale. */
  .detail-view { padding: 40px; max-width: 1000px; margin: 0 auto; }
  /* Styles pour les messages de chargement et d'erreur. */
  .loading-message, .error-message { text-align: center; font-size: 1.2em; margin-top: 50px; }
  /* Couleur spécifique pour l'erreur. */
  .error-message { color: #e74c3c; }
  /* Style du bouton de retour. */
  .back-button {
    margin-bottom: 20px;
    padding: 10px 15px;
    background-color: #f39c12;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  /* Style du conteneur des détails (utilisation de flexbox). */
  .film-details-container {
    display: flex;
    gap: 40px;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  /* Style de l'image de l'affiche. */
  .poster-section img {
    width: 300px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  /* La section d'information occupe le reste de l'espace. */
  .info-section { flex: 1; }
  /* Style du titre principal. */
  .title { font-size: 2.2em; margin-bottom: 10px; color: #34495e; }
  /* Style de l'année (petit et gris). */
  .year { font-size: 0.7em; color: #7f8c8d; font-weight: normal; }
  /* Style du synopsis. */
  .plot { margin-bottom: 25px; line-height: 1.6; color: #555; }
  /* Style des paragraphes dans les informations clés. */
  .key-info p { margin-bottom: 8px; }
  /* Style des labels en gras. */
  .key-info strong { color: #3498db; }
  </style>