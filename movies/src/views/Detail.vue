<script setup>
  // Importe la fonction 'ref' pour créer des variables réactives.
    import { ref, watch } from 'vue';
  // Importe 'useRoute' pour accéder aux paramètres de l'URL.
  // Importe 'useRouter' pour gérer la navigation (router.back()).
    import { useRoute, useRouter } from 'vue-router';
    
  // Définit la clé d'API OMDB.
    const API_KEY = "4726f8f9";
  // Définit l'URL de base de l'API OMDB.
    const BASE_URL = "http://www.omdbapi.com/";
    
  // Initialise l'objet 'route' pour accéder aux paramètres de l'URL.
    const route = useRoute();
  // Initialise l'objet 'router' pour la navigation.
    const router = useRouter();
  // Variable réactive pour stocker les détails complets du film.
    const filmDetail = ref(null);
  // Variable réactive pour gérer l'état de chargement.
    const isLoading = ref(true);
  // Variable réactive pour stocker les messages d'erreur éventuels.
    const error = ref(null);
    
    
  // Définition de la fonction asynchrone pour récupérer les détails d'un film.
    const fetchFilmDetail = async (imdbID) => {
  // Met l'état de chargement à vrai.
      isLoading.value = true;
  // Réinitialise le message d'erreur.
      error.value = null;
    
      try {
  // Construit l'URL de requête, demandant l'intrigue complète (plot=full).
        const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;
  // Exécute la requête HTTP.
        const res = await fetch(url);
  // Parse la réponse en JSON.
        const data = await res.json();
    
  // Vérifie si la réponse de l'API est positive ("True").
        if (data.Response === "True") {
  // Stocke les données du film.
          filmDetail.value = data;
        } else {
  // Stocke l'erreur de l'API ou un message par défaut.
          error.value = data.Error || "Détails du film introuvables.";
        }
      } catch (err) {
  // Capture et stocke les erreurs de connexion.
        error.value = `Erreur lors du chargement des détails : ${err.message}`;
      } finally {
  // Met l'état de chargement à faux.
        isLoading.value = false;
      }
    };
    
  // Bloc 'watch' essentiel : Surveille le paramètre de route 'id'.
    watch(
  // La source à surveiller : la valeur du paramètre 'id' dans l'URL.
      () => route.params.id, 
  // Fonction de rappel qui s'exécute lorsque l'ID change (pour le fix de l'image persistante).
      (newID) => {
  // Vérifie si un ID est présent.
        if (newID) {
  // Lance la récupération des données avec le nouvel ID.
          fetchFilmDetail(newID);
        } else {
  // Affiche une erreur si l'ID est manquant.
          error.value = "Erreur : ID du film manquant dans l'URL.";
          isLoading.value = false;
        }
      },
  // Option: Exécute le 'watch' immédiatement lors du montage initial.
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
  /* Style de base (écrans larges). */
  .detail-view { padding: 40px; max-width: 1000px; margin: 0 auto; }
  /* Styles des messages. */
  .loading-message, .error-message { text-align: center; font-size: 1.2em; margin-top: 50px; }
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
  
  /* Style de base pour les détails (Flexbox horizontal sur grand écran). */
  .film-details-container {
    display: flex;
    gap: 40px;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  /* Taille de l'affiche sur grand écran. */
  .poster-section img {
    width: 300px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .info-section { flex: 1; }
  .title { font-size: 2.2em; margin-bottom: 10px; color: #34495e; }
  .year { font-size: 0.7em; color: #7f8c8d; font-weight: normal; }
  .plot { margin-bottom: 25px; line-height: 1.6; color: #555; }
  .key-info p { margin-bottom: 8px; }
  .key-info strong { color: #3498db; }
  
  
  /* RÈGLES RESPONSIVES : Media Query pour les petits écrans (max 768px) ⭐️ */
  @media (max-width: 768px) {
    /* Réduit le padding général sur mobile. */
    .detail-view {
        padding: 15px; 
    }
    
    /* Change le Flexbox pour empiler les éléments verticalement sur mobile. */
    .film-details-container {
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }
    
    /* Centre l'affiche horizontalement. */
    .poster-section {
        display: flex;
        justify-content: center;
    }
  
    /* Ajuste la taille de l'affiche : prend 100% de l'espace disponible mais limitée à 250px. */
    .poster-section img {
        width: 100%;
        max-width: 250px; 
        height: auto;
    }
  
    /* Ajuste la taille du titre et le centre. */
    .title {
        font-size: 1.8em;
        text-align: center;
    }
  }
  </style>