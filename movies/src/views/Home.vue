<script setup>
  /* Importation des fonctions de reactivite de Vue */
  import { ref, computed, watch } from 'vue';
  /* Importation de la gestion des routes */
  import { useRouter } from 'vue-router';
  /* Importation du composant de carte de film */
  import FilmCard from '../components/FilmCard.vue';
  
  /* Configuration de l API */
  const API_KEY = "4726f8f9";
  const BASE_URL = "http://www.omdbapi.com/";
  /* On limite a 10 pages maximum pour respecter les contraintes OMDb */
  const API_HARD_LIMIT_PAGES = 10;
  const RESULTS_PER_PAGE = 10;
  
  /* Variables reactives */
  const searchTerm = ref('');
  const isLoading = ref(false);
  const error = ref(null);
  const currentPage = ref(1);
  const totalResults = ref(0);
  const sortCriteria = ref('None');
  const typeFilter = ref('');
  
  /* Liste qui contient la totalite des films (jusqu a 100) pour permettre un tri global */
  const allMovies = ref([]);
  
  /* Liste des categories pour les boutons radio */
  const availableTypes = ref([
    { label: 'Tous', value: '' },
    { label: 'Films', value: 'movie' },
    { label: 'Séries', value: 'series' },
    { label: 'Épisodes', value: 'episode' },
  ]);
  
  const router = useRouter();
  
  /* PROPRIETE CALCULEE : Gere le tri de TOUS les films et la pagination locale */
  const paginatedFilms = computed(() => {
    if (allMovies.value.length === 0) return [];
  
    /* On cree une copie pour ne pas modifier la liste originale */
    let sorted = [...allMovies.value];
  
    /* Tri global sur l ensemble des films recuperes */
    if (sortCriteria.value !== 'None') {
      const [field, direction] = sortCriteria.value.split('_');
  
      sorted.sort((a, b) => {
        let valA, valB;
        if (field === 'Year') {
          /* On prend la premiere annee pour les series (ex: 2010-2015) */
          valA = parseInt(a.Year.split('–')[0]) || 0;
          valB = parseInt(b.Year.split('–')[0]) || 0;
        } else {
          valA = a.Title.toLowerCase();
          valB = b.Title.toLowerCase();
        }
        
        let comparison = (valA < valB) ? -1 : (valA > valB) ? 1 : 0;
        return direction === 'asc' ? comparison : -comparison;
      });
    }
  
    /* Decoupage de la liste triee pour n afficher que 10 films par page */
    const start = (currentPage.value - 1) * RESULTS_PER_PAGE;
    const end = start + RESULTS_PER_PAGE;
    return sorted.slice(start, end);
  });
  
  /* Calcul du nombre de pages total pour l affichage de la pagination */
  const apiTotalPages = computed(() => {
    if (allMovies.value.length === 0) return 0;
    return Math.ceil(allMovies.value.length / RESULTS_PER_PAGE);
  });
  
  /* Surveillance du changement de categorie ou de tri */
  watch(typeFilter, () => {
    searchMovies();
  });
  
  /* FONCTION PRINCIPALE : Charge toutes les pages d un coup */
  const searchMovies = async () => {
    if (!searchTerm.value.trim()) {
      error.value = "Veuillez entrer un terme de recherche.";
      allMovies.value = [];
      return;
    }
  
    isLoading.value = true;
    error.value = null;
    allMovies.value = [];
    currentPage.value = 1;
  
    try {
      const typeParam = typeFilter.value ? `&type=${typeFilter.value}` : '';
      /* Premiere requete pour tester et obtenir le nombre total de resultats */
      const firstUrl = `${BASE_URL}?apikey=${API_KEY}&s=${searchTerm.value}&page=1${typeParam}`;
      
      const res = await fetch(firstUrl);
      const data = await res.json();
  
      if (data.Response === "True") {
        let combinedResults = [...data.Search];
        totalResults.value = parseInt(data.totalResults);
        
        /* Calcul du nombre de pages a recuperer (maximum 10) */
        const pagesToFetch = Math.min(Math.ceil(totalResults.value / 10), API_HARD_LIMIT_PAGES);
  
        /* Si plus d une page existe, on telecharge les autres en parallele */
        if (pagesToFetch > 1) {
          const promises = [];
          for (let p = 2; p <= pagesToFetch; p++) {
            const url = `${BASE_URL}?apikey=${API_KEY}&s=${searchTerm.value}&page=${p}${typeParam}`;
            promises.push(fetch(url).then(r => r.json()));
          }
          
          const responses = await Promise.all(promises);
          responses.forEach(pageData => {
            if (pageData.Search) {
              combinedResults = [...combinedResults, ...pageData.Search];
            }
          });
        }
  
        /* Mise a jour de la liste globale */
        allMovies.value = combinedResults;
      } else {
        error.value = data.Error === "Movie not found!" ? "Aucun résultat trouvé." : data.Error;
      }
    } catch (err) {
      error.value = "Erreur de connexion au serveur.";
    } finally {
      isLoading.value = false;
    }
  };
  
  /* Navigation entre les pages (sans nouvel appel API) */
  const changePage = (pageNumber) => {
    currentPage.value = pageNumber;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  /* Redirection vers le detail */
  const handleViewDetail = (imdbID) => {
    router.push(`/movie/${imdbID}`);
  };
  
  /* Calcul des boutons de pagination visibles */
  const visiblePages = computed(() => {
    const pages = [];
    const total = apiTotalPages.value;
    for (let i = 1; i <= total; i++) pages.push(i);
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
              @keyup.enter="searchMovies"
              placeholder="Entrez un titre de film..."
          />
          <button @click="searchMovies" :disabled="isLoading" class="search-button">Rechercher</button>
        </div>
  
        <div class="nav-buttons">
          <button @click="router.push('/historique')" class="history-button">Historique</button>
          <button @click="router.push('/favoris')" class="favorites-button">Favoris</button>
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
  
      <p v-if="isLoading" class="loader">Chargement des 100 résultats...</p>
      <p v-else-if="error" class="error-message">{{ error }}</p>
  
      <div v-if="paginatedFilms.length > 0" class="results-grid">
        <FilmCard
            v-for="film in paginatedFilms"
            :key="film.imdbID"
            :film="film"
            @view-detail="handleViewDetail" />
      </div>
  
      <div v-if="apiTotalPages > 1 && !isLoading" class="pagination-controls">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-button">Précédent</button>
        <button v-for="page in visiblePages" :key="page" @click="changePage(page)" :class="{'active-page': page === currentPage}" class="pagination-button">
          {{ page }}
        </button>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === apiTotalPages" class="pagination-button">Suivant</button>
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