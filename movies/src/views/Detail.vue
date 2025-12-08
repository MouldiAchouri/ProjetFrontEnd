<script setup>
  import { ref, watch } from 'vue'; // Import 'watch'
  import { useRoute, useRouter } from 'vue-router';
  
  // Clé OMDB API
  const API_KEY = "4726f8f9";
  const BASE_URL = "http://www.omdbapi.com/";
  
  const route = useRoute();
  const router = useRouter();
  const filmDetail = ref(null);
  const isLoading = ref(true);
  const error = ref(null);
  
  
  // récupère les informations complètes d'un film
  const fetchFilmDetail = async (imdbID) => {
    isLoading.value = true;
    error.value = null;
  
    try {
      const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;
      const res = await fetch(url);
      const data = await res.json();
  
      if (data.Response === "True") {
        filmDetail.value = data;
      } else {
        error.value = data.Error || "Détails du film introuvables.";
      }
    } catch (err) {
      error.value = `Erreur lors du chargement des détails : ${err.message}`;
    } finally {
      isLoading.value = false;
    }
  };
  
  // ✅ FIX FINAL: Watch the route parameter to re-fetch data on route change
  // We are watching 'route.params.id' to match your router setup (path: '/movie/:id')
  watch(
    // Source: Watch the 'id' parameter in the route
    () => route.params.id, 
    
    // Callback: Execute fetchFilmDetail with the new ID
    (newID) => {
      // Check if the ID exists (i.e., not null/undefined)
      if (newID) {
        // The parameter name passed to the function is now 'id'
        fetchFilmDetail(newID);
      } else {
        error.value = "Erreur : ID du film manquant dans l'URL.";
        isLoading.value = false;
      }
    },
    
    // Options: Run immediately upon component mount to load the initial film
    { immediate: true }
  );
  
  // affiche un texte pas d'affiche si aucune image n'est trouvé
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
  /* Styles remain the same */
  .detail-view { padding: 40px; max-width: 1000px; margin: 0 auto; }
  .loading-message, .error-message { text-align: center; font-size: 1.2em; margin-top: 50px; }
  .error-message { color: #e74c3c; }
  .back-button {
    margin-bottom: 20px;
    padding: 10px 15px;
    background-color: #f39c12;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .film-details-container {
    display: flex;
    gap: 40px;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
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
  </style>