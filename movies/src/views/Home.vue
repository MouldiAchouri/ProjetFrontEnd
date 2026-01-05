<script setup>
  /* Importation des fonctions de réactivité de Vue */
  import { ref, computed, watch } from 'vue';
  /* Importation de la fonction de gestion des routes pour la navigation */
  import { useRouter } from 'vue-router';
  /* Importation du composant affichant la carte individuelle d'un film */
  import FilmCard from '../components/FilmCard.vue';
  
  /* Definition de la clef api pour acceder a la base de donnees omdb */
  const API_KEY = "4726f8f9";
  /* Definition de l adresse de base de l api omdb */
  const BASE_URL = "http://www.omdbapi.com/";
  
  /* Limitation technique de l api a dix pages de resultats maximum */
  const API_HARD_LIMIT_PAGES = 10;
  /* Definition du nombre de resultats fournis par l api par page */
  const RESULTS_PER_PAGE = 10;
  
  /* Creation d une variable reactive pour stocker le texte recherche par l utilisateur */
  const searchTerm = ref('');
  /* Creation d une structure de type map pour mettre en cache les pages deja telechargees */
  const allFilmsMap = ref(new Map());
  /* Variable servant a indiquer si une requete est en cours de chargement */
  const isLoading = ref(false);
  /* Variable pour stocker et afficher les messages d erreur */
  const error = ref(null);
  
  /* Variable de suivi du numero de la page actuelle */
  const currentPage = ref(1);
  /* Stockage du nombre total de resultats trouves par l api */
  const totalResults = ref(0);
  
  /* Variable definissant le critere de tri actuel */
  const sortCriteria = ref('None');
  /* Variable stockant le filtre de categorie selectionne par l utilisateur */
  const typeFilter = ref(''); 
  /* Liste des categories disponibles pour le filtrage par radio boutons */
  const availableTypes = ref([
    { label: 'Tous', value: '' },
    { label: 'Films', value: 'movie' },
    { label: 'Séries', value: 'series' },
    { label: 'Épisodes', value: 'episode' },
  ]);
  
  /* Initialisation de l utilitaire de redirection de route */
  const router = useRouter();
  
  /* Calcul du nombre total de pages disponibles en limitant a dix selon les contraintes api */
  const apiTotalPages = computed(() => {
    /* Si aucun resultat n est trouve le nombre de pages est de zero */
    if (totalResults.value === 0) return 0;
    /* Division du total par dix et arrondi superieur pour obtenir le nombre de pages */
    const calculatedPages = Math.ceil(totalResults.value / RESULTS_PER_PAGE);
    /* Retour du minimum entre le calcul et la limite imposee de dix */
    return Math.min(calculatedPages, API_HARD_LIMIT_PAGES);
  });
  
  /* Calcul de la liste des films a afficher pour la page en cours */
  const paginatedFilms = computed(() => {
    /* Recupere les donnees de la page actuelle depuis le cache ou retourne une liste vide */
    let list = allFilmsMap.value.get(currentPage.value) || [];
  
    /* Si la liste est vide ou si aucun tri n est demande on retourne la liste telle quelle */
    if (list.length === 0 || sortCriteria.value === 'None') {
      return list;
    }
  
    /* Creation d une copie de la liste pour eviter de modifier les donnees originales */
    const sorted = [...list];
    /* Separation de la chaine de critere pour obtenir le champ et la direction du tri */
    const [field, direction] = sortCriteria.value.split('_');
  
    /* Algorithme de tri base sur l annee ou le titre */
    sorted.sort((a, b) => {
      let valA, valB;
      /* Cas du tri par annee */
      if (field === 'Year') {
        /* Extraction de la premiere annee pour les series a dates multiples */
        valA = parseInt(a.Year.split('–')[0]) || 0;
        valB = parseInt(b.Year.split('–')[0]) || 0;
        /* Tri alphabetique secondaire si les annees sont identiques */
        if (valA === valB) return a.Title.localeCompare(b.Title);
      } else if (field === 'Title') {
        /* Cas du tri par titre */
        valA = a.Title;
        valB = b.Title;
      } else {
        /* Retour par defaut si le champ n est pas reconnu */
        return 0;
      }
      /* Execution de la comparaison selon le type de donnees et la direction choisie */
      let comparison = (typeof valA === 'string') ? valA.localeCompare(valB) : valA - valB;
      return direction === 'asc' ? comparison : -comparison;
    });
  
    /* Retourne la liste triee pour l affichage */
    return sorted;
  });
  
  /* Surveillance des changements de recherche ou de tri pour revenir a la premiere page */
  watch([searchTerm, sortCriteria], () => {
    currentPage.value = 1;
  });
  
  /* Surveillance du changement de categorie pour vider le cache et relancer une recherche */
  watch(typeFilter, () => {
    /* Reinitialisation du cache des films car les resultats api vont changer */
    allFilmsMap.value = new Map();
    /* Retour a la page un */
    currentPage.value = 1;
    /* Appel de la fonction de recherche pour la nouvelle categorie */
    searchMovies(1);
  });
  
  /* Fonction asynchrone pour recuperer les films depuis l api */
  const searchMovies = async (page = 1) => {
    /* Verification que le champ de recherche n est pas vide */
    if (!searchTerm.value.trim()) {
      error.value = "Veuillez entrer un terme de recherche.";
      allFilmsMap.value = new Map();
      totalResults.value = 0;
      return false;
    }
  
    /* Arret de la fonction si la page demandee depasse la limite de dix */
    if (page > API_HARD_LIMIT_PAGES) return false;
  
    /* Activation de l indicateur de chargement */
    isLoading.value = true;
    /* Effacement des anciennes erreurs */
    error.value = null;
  
    /* Reinitialisation des donnees lors d une nouvelle recherche initiale */
    if (page === 1) {
      allFilmsMap.value = new Map();
      totalResults.value = 0;
    }
  
    /* Verification si la page est deja en cache pour eviter un appel reseau inutile */
    if (allFilmsMap.value.has(page)) {
      isLoading.value = false;
      return true;
    }
  
    try {
      /* Preparation du parametre de type pour l url si un filtre est actif */
      const typeParam = typeFilter.value ? `&type=${typeFilter.value}` : '';
      /* Construction de l url complete avec la clef api le terme la page et le type */
      const url = `${BASE_URL}?apikey=${API_KEY}&s=${searchTerm.value}&page=${page}${typeParam}`;
      
      /* Envoi de la requete au serveur */
      const res = await fetch(url);
      /* Conversion de la reponse en format json */
      const data = await res.json();
  
      /* Traitement en cas de succes de la reponse api */
      if (data.Response === "True" && data.Search) {
        /* Ajout des nouveaux films dans la map de cache avec le numero de page en clef */
        allFilmsMap.value.set(page, data.Search);
        /* Mise a jour de la map pour declencher la reactivite vue */
        allFilmsMap.value = new Map(allFilmsMap.value); 
        /* Mise a jour du nombre total de resultats converti en entier */
        totalResults.value = parseInt(data.totalResults);
        return true;
      } else {
        /* Traduction personnalisee des messages d erreur selon le contexte de recherche */
        if (data.Error === "Movie not found!") {
          if (typeFilter.value === 'episode') {
            error.value = "Aucun épisode trouvé pour cette recherche.";
          } else if (typeFilter.value === 'series') {
            error.value = "Aucune série trouvée pour cette recherche.";
          } else {
            error.value = "Aucun film trouvé pour cette recherche.";
          }
        } else {
          /* Affichage de l erreur retournee par l api par defaut */
          error.value = data.Error || "Aucun résultat trouvé.";
        }
        return false;
      }
    } catch (err) {
      /* Capture des erreurs de connexion ou de code */
      error.value = `Erreur : ${err.message}`;
      return false;
    } finally {
      /* Desactivation de l indicateur de chargement dans tous les cas */
      isLoading.value = false;
    }
  };
  
  /* Fonction de changement de page declenchee par la pagination */
  const changePage = async (pageNumber) => {
    /* Verification que le numero de page est valide et compris dans les bornes */
    if (pageNumber < 1 || pageNumber > apiTotalPages.value) return;
  
    /* Telechargement des donnees si la page demandee n est pas encore en cache */
    if (!allFilmsMap.value.has(pageNumber)) {
      const success = await searchMovies(pageNumber);
      /* Arret si le chargement a echoue */
      if (!success) return;
    }
  
    /* Mise a jour du numero de page actuelle */
    currentPage.value = pageNumber;
    /* Remontée fluide de la fenetre vers le haut de la page */
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  /* Redirection vers la vue detaillee d un film via son identifiant unique */
  const handleViewDetail = (imdbID) => {
    router.push(`/movie/${imdbID}`);
  };
  
  /* Calcul de la liste des numeros de pages a afficher dans l interface */
  const visiblePages = computed(() => {
    const pages = [];
    /* Nombre maximum de boutons de pages visibles simultanement */
    const maxPagesToShow = 5;
    const total = apiTotalPages.value;
    const current = currentPage.value;
  
    /* Calcul de l index de depart pour centrer la page actuelle */
    let startPage = Math.max(1, current - Math.floor(maxPagesToShow / 2));
    /* Calcul de l index de fin */
    let endPage = Math.min(total, startPage + maxPagesToShow - 1);
  
    /* Ajustement si l on est proche de la fin de la liste */
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
  
    /* Remplissage du tableau avec les numeros de pages calcules */
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
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-button">Precedent</button>
        <button v-for="page in visiblePages" :key="page" @click="changePage(page)" :class="{'active-page': page === currentPage}" class="pagination-button">
          {{ page }}
        </button>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === apiTotalPages" class="pagination-button">Suivant</button>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* Definition des styles css pour la mise en page et les elements visuels */
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