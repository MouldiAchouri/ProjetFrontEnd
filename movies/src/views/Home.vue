<script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import FilmCard from '../components/FilmCard.vue';
  
  const API_KEY = "4726f8f9";
  const BASE_URL = "http://www.omdbapi.com/";
  
  const searchTerm = ref('');
  const films = ref([]); // Liste brute non triée/filtrée des résultats API
  const isLoading = ref(false);
  const error = ref(null);
  
  const currentPage = ref(1);
  const totalResults = ref(0);
  const RESULTS_PER_PAGE = 10;
  
  // Tri existant
  const sortCriteria = ref('None'); 
  // ⭐️ MODIFICATION : typeFilter devient un TABLEAU pour la sélection multiple ⭐️
  const typeFilter = ref([]); 
  const availableTypes = ref([
      { label: 'Films', value: 'movie' },
      { label: 'Séries', value: 'series' },
      { label: 'Épisodes', value: 'episode' },
  ]);
  
  const router = useRouter();
  
  const totalPages = computed(() => {
      if (totalResults.value === 0) return 0;
      return Math.ceil(totalResults.value / RESULTS_PER_PAGE);
  });
  
  const searchMovies = async (page = 1) => {
    if (!searchTerm.value.trim()) {
      error.value = "Veuillez entrer un terme de recherche.";
      films.value = [];
      return;
    }
  
    isLoading.value = true;
    error.value = null;
    films.value = [];
    currentPage.value = page;
    
    // Réinitialiser le tri et le filtre lors d'une nouvelle recherche
    sortCriteria.value = 'None'; 
    typeFilter.value = []; // Réinitialise le tableau de filtres
  
    try {
      const url = `${BASE_URL}?apikey=${API_KEY}&s=${searchTerm.value}&page=${page}`;
      const res = await fetch(url);
      const data = await res.json();
  
      if (data.Response === "True") {
        films.value = data.Search;
        totalResults.value = parseInt(data.totalResults);
      } else {
        error.value = data.Error || "Aucun film trouvé pour cette recherche.";
        totalResults.value = 0;
      }
    } catch (err) {
      error.value = `Erreur inattendue : ${err.message}`;
      totalResults.value = 0;
    } finally {
      isLoading.value = false;
    }
  };
  
  const goToDetail = (imdbID) => {
    router.push(`/movie/${imdbID}`);
  };
  
  const handleViewDetail = (imdbID) => {
    goToDetail(imdbID);
  };
  
  const goToHistory = () => {
      router.push('/historique');
  };
  
  const goToFavorites = () => {
      router.push('/favoris');
  };
  
  const changePage = (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages.value) {
          searchMovies(pageNumber);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };
  
  const visiblePages = computed(() => {
      const pages = [];
      const maxPagesToShow = 5;
      let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);
  
      if (endPage - startPage < maxPagesToShow - 1) {
          startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
      }
      return pages;
  });
  
  // ⭐️ LOGIQUE COMBINÉE : Filtre (multi-sélection) puis Tri ⭐️
  const filteredAndSortedFilms = computed(() => {
      // 1. Filtrage par type
      let listToProcess = films.value;
      
      // Si des filtres sont sélectionnés, on filtre la liste
      if (typeFilter.value.length > 0) {
          listToProcess = films.value.filter(film => 
              // Vérifie si le Type du film est INCLUS dans le tableau typeFilter
              film.Type && typeFilter.value.includes(film.Type.toLowerCase())
          );
      }
      
      // 2. Tri (le code de tri existant est réutilisé ici)
      if (listToProcess.length === 0 || sortCriteria.value === 'None') {
          return listToProcess;
      }
  
      const sorted = [...listToProcess]; 
      const [field, direction] = sortCriteria.value.split('_');
  
      sorted.sort((a, b) => {
          let valA, valB;
  
          if (field === 'Year') {
              valA = parseInt(a.Year.split('–')[0]) || 0;
              valB = parseInt(b.Year.split('–')[0]) || 0;
              
              if (valA === valB) {
                  return a.Title.localeCompare(b.Title); 
              }
          } else if (field === 'Title') {
              valA = a.Title;
              valB = b.Title;
          } else {
              return 0;
          }
  
          let comparison = 0;
          if (typeof valA === 'string') {
              comparison = valA.localeCompare(valB);
          } else {
              comparison = valA - valB;
          }
  
          return direction === 'asc' ? comparison : -comparison;
      });
  
      return sorted;
  });
  </script>
  
  <template>
    <div class="home-view">
      <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Recherche de Films OMDb</h1>
  
      <div class="toolbar-container">
          <div class="search-bar">
              <input
                  v-model="searchTerm"
                  @keyup.enter="() => searchMovies(1)"
                  placeholder="Entrez un titre de film..."
              />
              <button @click="() => searchMovies(1)" :disabled="isLoading" class="search-button">Rechercher</button>
          </div>
  
          <button @click="goToHistory" class="history-button">
              Historique 🕰️
          </button>
          <button @click="goToFavorites" class="favorites-button"> 
              Favoris ❤️
          </button>
          
          <select v-model="sortCriteria" class="sort-select">
              <option value="None">Trier par...</option>
              <option value="Year_desc">Année (Récent > Ancien)</option>
              <option value="Year_asc">Année (Ancien > Récent)</option>
              <option value="Title_asc">Titre (A-Z)</option>
              <option value="Title_desc">Titre (Z-A)</option>
          </select>
          
          <div class="type-filter-group">
              <label class="filter-label">Catégories :</label>
              <div class="checkbox-container">
                  <div v-for="typeOption in availableTypes" :key="typeOption.value" class="checkbox-item">
                      <input 
                          type="checkbox" 
                          :id="typeOption.value" 
                          :value="typeOption.value" 
                          v-model="typeFilter"
                      />
                      <label :for="typeOption.value">{{ typeOption.label }}</label>
                  </div>
              </div>
          </div>
          </div>
  
      <p v-if="isLoading" class="text-center text-blue-500 font-semibold mt-4">Chargement...</p>
      <p v-else-if="error" class="error-message">Erreur : {{ error }}</p>
  
      <p v-else-if="totalResults > 0" class="results-summary">
          Total des résultats trouvés : {{ totalResults }} films/séries.
      </p>
      
      <div v-if="filteredAndSortedFilms.length > 0" class="results-grid">
        <FilmCard
            v-for="film in filteredAndSortedFilms"
            :key="film.imdbID"
            :film="film"
            @view-detail="handleViewDetail" />
      </div>
      <p v-else-if="!isLoading && totalResults > 0 && typeFilter.length > 0" class="text-center mt-4 text-gray-600">
          Aucun résultat correspondant aux catégories sélectionnées.
      </p>
  
  
      <div v-if="totalPages > 1 && !isLoading" class="pagination-controls">
          <button 
              @click="changePage(currentPage - 1)" 
              :disabled="currentPage === 1"
              class="pagination-button prev-next">
              &lt; Précédent
          </button>
          
          <template v-for="page in visiblePages" :key="page">
              <button
                  @click="changePage(page)"
                  :class="{'active-page': page === currentPage}"
                  class="pagination-button page-number">
                  {{ page }}
              </button>
          </template>
          
          <button 
              @click="changePage(currentPage + 1)" 
              :disabled="currentPage === totalPages"
              class="pagination-button prev-next">
              Suivant &gt;
          </button>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* ⭐️ STYLES DES BOUTONS ET SÉLECTEURS (Restauration) ⭐️ */
  
  .home-view { 
      padding: 20px; 
      max-width: 1200px; 
      margin: 0 auto; 
  }
  
  .toolbar-container {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      align-items: center; 
      /* Permet le wrapping sur les petits écrans */
      flex-wrap: wrap; 
  }
  
  .search-bar { 
      display: flex; 
      gap: 10px; 
      flex-grow: 1; 
  }
  
  .search-bar input { 
      flex: 1; 
      padding: 12px; 
      font-size: 16px; 
      border: 1px solid #ccc; 
      border-radius: 6px; 
  }
  
  /* Style du bouton de RECHERCHE */
  .search-button { 
      padding: 12px 20px; 
      font-size: 16px; 
      border: none; 
      border-radius: 6px; 
      background-color: #3498db; /* Bleu */
      color: white; 
      cursor: pointer; 
      transition: background-color 0.2s; 
      height: 42px; 
      white-space: nowrap; 
  }
  .search-button:hover:not(:disabled) { 
      background-color: #2980b9; 
  }
  .search-button:disabled { 
      background-color: #bdc3c7; 
      cursor: not-allowed; 
  }
  
  /* Style des boutons de navigation */
  .history-button, .favorites-button {
      padding: 12px 20px;
      font-size: 16px;
      border: none;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      transition: background-color 0.2s;
      height: 42px; 
      white-space: nowrap; 
  }
  .history-button {
      background-color: #f39c12; /* Orange */
  }
  .history-button:hover {
      background-color: #e67e22;
  }
  .favorites-button {
      background-color: #e74c3c; /* Rouge */
  }
  .favorites-button:hover {
      background-color: #c0392b;
  }
  
  /* Style pour le sélecteur de tri */
  .sort-select {
      padding: 12px 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background-color: white;
      cursor: pointer;
      height: 42px;
      white-space: nowrap;
  }
  
  /* ⭐️ STYLES POUR LE GROUPE DE CASES À COCHER (MULTI-SÉLECTION) ⭐️ */
  .type-filter-group {
      display: flex;
      align-items: center;
      gap: 10px;
      border: 1px solid #ccc; /* Bordure similaire aux autres contrôles */
      padding: 8px 10px;
      border-radius: 6px;
      background-color: white;
      white-space: nowrap;
  }
  
  .filter-label {
      font-size: 14px;
      color: #34495e;
      font-weight: bold;
  }
  
  .checkbox-container {
      display: flex;
      gap: 15px;
      align-items: center;
  }
  
  .checkbox-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
  }
  /* --------------------------------------- */
  
  
  /* Styles pour les résultats */
  .results-summary {
      text-align: center;
      font-size: 1.1em;
      margin-bottom: 20px;
      color: #34495e;
  }
  
  .results-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    padding-top: 20px;
  }
  
  /* Styles de Pagination */
  .pagination-controls {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 40px;
      margin-bottom: 20px;
  }
  .pagination-button {
      padding: 10px 16px;
      font-size: 1em;
      border: 1px solid #ccc;
      background-color: white;
      color: #34495e;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s, border-color 0.2s;
  }
  .pagination-button:hover:not(:disabled):not(.active-page) {
      background-color: #f0f0f0;
      border-color: #999;
  }
  .pagination-button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
  }
  .pagination-button.active-page {
      background-color: #3498db;
      color: white;
      border-color: #3498db;
      font-weight: bold;
  }
  
  /* RÈGLES RESPONSIVES minimales */
  @media (max-width: 900px) {
      /* Permet aux filtres de s'empiler en dessous des boutons de recherche sur les tablettes et mobiles */
      .toolbar-container {
          flex-direction: column;
          align-items: stretch;
      }
      .search-bar {
          width: 100%;
          flex-direction: column;
          gap: 10px;
      }
      .search-bar button, .search-bar input {
          width: 100%;
          box-sizing: border-box; 
      }
      .history-button, .favorites-button, .sort-select {
          width: 100%;
      }
      .type-filter-group {
          width: 100%;
          /* Affiche le groupe de filtres en colonne si nécessaire */
          flex-direction: column; 
          align-items: flex-start;
      }
      .checkbox-container {
          /* Permet aux checkboxes de s'enrouler sur les très petits écrans */
          flex-wrap: wrap; 
      }
  }
  </style>