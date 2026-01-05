<script setup>
  import { ref, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import FilmCard from '../components/FilmCard.vue';
  
  const API_KEY = "4726f8f9";
  const BASE_URL = "http://www.omdbapi.com/";
  
  // OMDb API limit (10 results per page)
  const API_HARD_LIMIT_PAGES = 10;
  const RESULTS_PER_PAGE = 10;
  
  const searchTerm = ref('');
  const allFilmsMap = ref(new Map());
  const isLoading = ref(false);
  const error = ref(null);
  
  const currentPage = ref(1);
  const totalResults = ref(0);
  
  const sortCriteria = ref('None');
  // Default to empty string (All types)
  const typeFilter = ref(''); 
  const availableTypes = ref([
    { label: 'Tous', value: '' },
    { label: 'Films', value: 'movie' },
    { label: 'Séries', value: 'series' },
    { label: 'Épisodes', value: 'episode' },
  ]);
  
  const router = useRouter();
  
  // Total pages calculation
  const apiTotalPages = computed(() => {
    if (totalResults.value === 0) return 0;
    const calculatedPages = Math.ceil(totalResults.value / RESULTS_PER_PAGE);
    return Math.min(calculatedPages, API_HARD_LIMIT_PAGES);
  });
  
  // The movies to display on the current page
  const paginatedFilms = computed(() => {
    // If we have the data for the current page in our Map, use it.
    let list = allFilmsMap.value.get(currentPage.value) || [];
  
    if (list.length === 0 || sortCriteria.value === 'None') {
      return list;
    }
  
    // Local Sorting (for the current page's 10 results)
    const sorted = [...list];
    const [field, direction] = sortCriteria.value.split('_');
  
    sorted.sort((a, b) => {
      let valA, valB;
      if (field === 'Year') {
        valA = parseInt(a.Year.split('–')[0]) || 0;
        valB = parseInt(b.Year.split('–')[0]) || 0;
        if (valA === valB) return a.Title.localeCompare(b.Title);
      } else if (field === 'Title') {
        valA = a.Title;
        valB = b.Title;
      } else {
        return 0;
      }
      let comparison = (typeof valA === 'string') ? valA.localeCompare(valB) : valA - valB;
      return direction === 'asc' ? comparison : -comparison;
    });
  
    return sorted;
  });
  
  // Watchers
  watch([searchTerm, sortCriteria], () => {
    currentPage.value = 1;
  });
  
  // When the category changes, we MUST clear the cache and fetch again
  watch(typeFilter, () => {
    allFilmsMap.value = new Map();
    currentPage.value = 1;
    searchMovies(1);
  });
  
  const searchMovies = async (page = 1) => {
    if (!searchTerm.value.trim()) {
      error.value = "Veuillez entrer un terme de recherche.";
      allFilmsMap.value = new Map();
      totalResults.value = 0;
      return false;
    }
  
    // If jumping too far
    if (page > API_HARD_LIMIT_PAGES) return false;
  
    isLoading.value = true;
    error.value = null;
  
    // Clear everything on a brand new search
    if (page === 1) {
      allFilmsMap.value = new Map();
      totalResults.value = 0;
    }
  
    // Use the API cache if we already have this page
    if (allFilmsMap.value.has(page)) {
      isLoading.value = false;
      return true;
    }
  
    try {
      // We add &type= to the URL so the API filters for us
      const typeParam = typeFilter.value ? `&type=${typeFilter.value}` : '';
      const url = `${BASE_URL}?apikey=${API_KEY}&s=${searchTerm.value}&page=${page}${typeParam}`;
      
      const res = await fetch(url);
      const data = await res.json();
  
      if (data.Response === "True" && data.Search) {
        allFilmsMap.value.set(page, data.Search);
        // Trigger reactivity for the Map
        allFilmsMap.value = new Map(allFilmsMap.value); 
        totalResults.value = parseInt(data.totalResults);
        return true;
      } else {
        error.value = data.Error || "Aucun résultat trouvé.";
        return false;
      }
    } catch (err) {
      error.value = `Erreur : ${err.message}`;
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  const changePage = async (pageNumber) => {
    if (pageNumber < 1 || pageNumber > apiTotalPages.value) return;
  
    // Fetch the data for the new page if it's not in the Map
    if (!allFilmsMap.value.has(pageNumber)) {
      const success = await searchMovies(pageNumber);
      if (!success) return;
    }
  };
  
  const handleViewDetail = (imdbID) => {
    router.push(`/movie/${imdbID}`);
  };
  
  const visiblePages = computed(() => {
    const pages = [];
    const maxPagesToShow = 5;
    const total = apiTotalPages.value;
    const current = currentPage.value;
  
    let startPage = Math.max(1, current - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(total, startPage + maxPagesToShow - 1);
  
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
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
  
        <div class="nav-buttons">
          <button @click="router.push('/historique')" class="history-button">Historique 🕰️</button>
          <button @click="router.push('/favoris')" class="favorites-button">Favoris ❤️</button>
        </div>
  
        <select v-model="sortCriteria" class="sort-select">
          <option value="None">Trier par...</option>
          <option value="Year_desc">Année (Récent > Ancien)</option>
          <option value="Year_asc">Année (Ancien > Récent)</option>
          <option value="Title_asc">Titre (A-Z)</option>
          <option value="Title_desc">Titre (Z-A)</option>
        </select>
  
        <div class="type-filter-group">
          <label class="filter-label">Catégorie :</label>
          <div class="radio-container">
            <div v-for="typeOption in availableTypes" :key="typeOption.value" class="radio-item">
              <input
                  type="radio"
                  :id="typeOption.value || 'all'"
                  :value="typeOption.value"
                  v-model="typeFilter"
              />
              <label :for="typeOption.value || 'all'">{{ typeOption.label }}</label>
            </div>
          </div>
        </div>
      </div>
  
      <p v-if="isLoading" class="loader">Chargement...</p>
      <p v-else-if="error" class="error-message">Erreur : {{ error }}</p>
  
      <div v-if="paginatedFilms.length > 0" class="results-grid">
        <FilmCard
            v-for="film in paginatedFilms"
            :key="film.imdbID"
            :film="film"
            @view-detail="handleViewDetail" />
      </div>
  
      <div v-if="apiTotalPages > 1 && paginatedFilms.length > 0 && !isLoading" class="pagination-controls">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-button">&lt;</button>
        <button v-for="page in visiblePages" :key="page" @click="changePage(page)" :class="{'active-page': page === currentPage}" class="pagination-button">
          {{ page }}
        </button>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === apiTotalPages" class="pagination-button">&gt;</button>
      </div>
    </div>
  </template>
  
  <style scoped>
  .home-view { padding: 20px; max-width: 1200px; margin: 0 auto; }
  .toolbar-container { display: flex; gap: 15px; margin-bottom: 30px; align-items: center; flex-wrap: wrap; }
  .search-bar { display: flex; gap: 10px; flex-grow: 1; }
  .search-bar input { flex: 1; padding: 12px; border: 1px solid #ccc; border-radius: 6px; }
  .search-button { padding: 12px 20px; border-radius: 6px; background: #3498db; color: white; border: none; cursor: pointer; }
  .nav-buttons { display: flex; gap: 10px; }
  .history-button { background: #f39c12; color: white; padding: 12px; border-radius: 6px; border: none; cursor: pointer; }
  .favorites-button { background: #e74c3c; color: white; padding: 12px; border-radius: 6px; border: none; cursor: pointer; }
  .sort-select { padding: 12px; border-radius: 6px; border: 1px solid #ccc; }
  .type-filter-group { display: flex; gap: 10px; align-items: center; background: white; padding: 8px 12px; border-radius: 6px; border: 1px solid #ccc; }
  .radio-container { display: flex; gap: 10px; }
  .radio-item { display: flex; align-items: center; gap: 4px; font-size: 14px; }
  .results-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
  .loader { text-align: center; color: #3498db; font-weight: bold; margin-top: 20px; }
  .error-message { text-align: center; color: #e74c3c; margin-top: 20px; }
  .pagination-controls { display: flex; justify-content: center; gap: 8px; margin-top: 40px; }
  .pagination-button { padding: 8px 14px; border: 1px solid #ccc; background: white; cursor: pointer; border-radius: 4px; }
  .active-page { background: #3498db; color: white; border-color: #3498db; }
  </style>