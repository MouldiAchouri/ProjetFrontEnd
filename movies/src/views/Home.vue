<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import FilmCard from '../components/FilmCard.vue';

const API_KEY = "4726f8f9";
const BASE_URL = "http://www.omdbapi.com/";

// ⭐️ LIMITE CRUCIALE : L'API OMDb ne peut retourner que 100 résultats maximum (10 pages) ⭐️
const API_HARD_LIMIT_PAGES = 10;
const RESULTS_PER_PAGE = 10;

const searchTerm = ref('');
const allFilmsMap = ref(new Map());
const isLoading = ref(false);
const error = ref(null);

const currentPage = ref(1);
const totalResults = ref(0);

const sortCriteria = ref('None');
const typeFilter = ref([]);
const availableTypes = ref([
  { label: 'Films', value: 'movie' },
  { label: 'Séries', value: 'series' },
  { label: 'Épisodes', value: 'episode' },
]);

const router = useRouter();

// Total des pages basé sur le total de l'API, mais limité à 10.
const apiTotalPages = computed(() => {
  if (totalResults.value === 0) return 0;
  const calculatedPages = Math.ceil(totalResults.value / RESULTS_PER_PAGE);
  return Math.min(calculatedPages, API_HARD_LIMIT_PAGES);
});

// 1. Fusionne toutes les pages API chargées.
const allLoadedFilms = computed(() => {
  const list = [];
  const pageKeys = Array.from(allFilmsMap.value.keys()).sort((a, b) => a - b);

  pageKeys.forEach(pageKey => {
    list.push(...allFilmsMap.value.get(pageKey));
  });
  return list;
});

// 2. Filtre et Trie la liste COMPLÈTE (Cohérence garantie).
const filteredAndSortedFilms = computed(() => {
  let listToProcess = allLoadedFilms.value;

  // Filtrage
  if (typeFilter.value.length > 0) {
    listToProcess = listToProcess.filter(film =>
        film.Type && typeFilter.value.includes(film.Type.toLowerCase())
    );
  }

  // Tri
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
      if (valA === valB) { return a.Title.localeCompare(b.Title); }
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

// 3. Extrait les 10 films de la page LOCALE (Cohérence de 10 films/page garantie).
const paginatedFilms = computed(() => {
  const list = filteredAndSortedFilms.value;
  const start = (currentPage.value - 1) * RESULTS_PER_PAGE;
  const end = start + RESULTS_PER_PAGE;
  return list.slice(start, end);
});

// 4. Calcule le nombre de pages en fonction des résultats filtrés.
const localTotalPages = computed(() => {
  if (filteredAndSortedFilms.value.length === 0) return 0;
  return Math.ceil(filteredAndSortedFilms.value.length / RESULTS_PER_PAGE);
});

// Le nombre de pages affiché à l'utilisateur.
const displayTotalPages = computed(() => {
  // Si l'utilisateur a activé un filtre, on ne peut se baser QUE sur ce qu'on a chargé
  if (typeFilter.value.length > 0) {
    return localTotalPages.value;
  }
  // Sinon, on suit la pagination de l'API (limitée à 10 pages)
  return apiTotalPages.value;
});

// 5. Watchers pour la cohérence
watch(
    [searchTerm, typeFilter, sortCriteria],
    () => {
      console.log("Critères modifiés -> Retour page 1");
      currentPage.value = 1;
    }
);


const searchMovies = async (page = 1) => {
  if (!searchTerm.value.trim()) {
    error.value = "Veuillez entrer un terme de recherche.";
    allFilmsMap.value = new Map();
    totalResults.value = 0;
    return false;
  }

  // ⭐️ NOUVEAU CHECK D'ERREUR : Empêche la répétition en bloquant les appels invalides ⭐️
  if (page > API_HARD_LIMIT_PAGES && page > apiTotalPages.value) {
    isLoading.value = false;
    error.value = `L'API OMDb est limitée aux ${API_HARD_LIMIT_PAGES} premières pages. La page ${page} n'est pas accessible.`;
    return false;
  }

  isLoading.value = true;
  error.value = null;

  if (page === 1) {
    allFilmsMap.value = new Map();
    sortCriteria.value = 'None';
    typeFilter.value = [];
    totalResults.value = 0;
  }

  if (allFilmsMap.value.has(page)) {
    isLoading.value = false;
    return true;
  }

  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&s=${searchTerm.value}&page=${page}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "True" && data.Search && data.Search.length > 0) {
      // ⭐️ SÉCURITÉ : N'ajoute la page que si elle est valide et contient des films ⭐️
      allFilmsMap.value.set(page, data.Search);
      allFilmsMap.value = new Map(allFilmsMap.value);
      totalResults.value = parseInt(data.totalResults);
      return true;
    } else {
      // Si Response est 'True' mais qu'il n'y a pas de Search (erreur bizarre ou fin des résultats réels)
      error.value = data.Error || `Fin des résultats disponibles après la page ${page - 1}.`;
      return false;
    }
  } catch (err) {
    error.value = `Erreur inattendue : ${err.message}`;
    if (page === 1) {
      totalResults.value = 0;
      allFilmsMap.value = new Map();
    }
    return false;
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

// Fonction changePage (Logique séquentielle pour garantir les données)
const changePage = async (pageNumber) => {
  if (pageNumber < 1 || pageNumber > displayTotalPages.value) {
    return;
  }

  const requiredApiPage = pageNumber;
  let dataLoaded = true;

  // 1. Vérifie et charge les données manquantes AVANT de changer la page locale.
  if (!allFilmsMap.value.has(requiredApiPage) && requiredApiPage <= apiTotalPages.value) {
    dataLoaded = await searchMovies(requiredApiPage);
  }

  // 2. Mise à jour de la page locale UNIQUEMENT si les données sont prêtes et chargées.
  if (dataLoaded) {
    currentPage.value = pageNumber;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const visiblePages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;
  const total = displayTotalPages.value;
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

    <div v-if="paginatedFilms.length > 0" class="results-grid">
      <FilmCard
          v-for="film in paginatedFilms"
          :key="film.imdbID"
          :film="film"
          @view-detail="handleViewDetail" />
    </div>
    <p v-else-if="!isLoading && totalResults > 0 && allLoadedFilms.length > 0 && paginatedFilms.length === 0" class="text-center mt-4 text-gray-600">
      Aucun résultat correspondant aux catégories sélectionnées.
    </p>


    <div v-if="displayTotalPages > 1 && paginatedFilms.length > 0 && !isLoading" class="pagination-controls">
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
          :disabled="currentPage === displayTotalPages"
          class="pagination-button prev-next">
        Suivant &gt;
      </button>
    </div>
  </div>
</template>

<style scoped>
/* (Styles inchangés) */
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

.search-button {
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  background-color: #3498db;
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
  background-color: #f39c12;
}
.history-button:hover {
  background-color: #e67e22;
}
.favorites-button {
  background-color: #e74c3c;
}
.favorites-button:hover {
  background-color: #c0392b;
}

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

.type-filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #ccc;
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

@media (max-width: 900px) {
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
    flex-direction: column;
    align-items: flex-start;
  }
  .checkbox-container {
    flex-wrap: wrap;
  }
}
</style>