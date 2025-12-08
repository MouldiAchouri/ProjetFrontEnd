

import { reactive, readonly, watch } from 'vue';

const STORAGE_KEY = 'movieFavorites'; 

// 1. Lire l'état initial depuis localStorage pour la persistance
const initialList = (() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Erreur lors de la lecture du localStorage pour les favoris:", e);
    return [];
  }
})();


// L'état réactif qui contiendra les films favoris.
const state = reactive({
  list: initialList, 
});

// Les actions (méthodes pour modifier l'état).
const actions = {
  /**
   * Ajoute ou supprime un film de la liste des favoris.
   * @param {Object} film - L'objet film à ajouter/supprimer.
   */
  toggleFavorite(film) {

    const filmData = {
        imdbID: film.imdbID,
        Title: film.Title,
        Poster: film.Poster,
        Year: film.Year,
        Type: film.Type || 'N/A',
    };
    
    // Vérifie si le film est déjà présent en utilisant son ID IMDb.
    const index = state.list.findIndex(f => f.imdbID === filmData.imdbID);

    if (index !== -1) {
      // Si trouvé, le supprime (retrait des favoris).
      state.list.splice(index, 1);
      console.log(`[Favorites] Retiré : ${filmData.Title}`);
      return false; // Indique qu'il a été retiré
    } else {
      // S'il n'est pas trouvé, l'ajoute (ajout aux favoris).
      state.list.unshift(filmData); 
      console.log(`[Favorites] Ajouté : ${filmData.Title}`);
      return true; // Indique qu'il a été ajouté
    }
  },

  /**
   * Vérifie si un film est déjà marqué comme favori.
   * @param {string} imdbID - L'ID IMDb du film.
   * @returns {boolean}
   */
  isFavorite(imdbID) {
    return state.list.some(f => f.imdbID === imdbID);
  },
};

watch(
  () => state.list,
  (newList) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  },
  { deep: true }
);


// Exporte l'état (en lecture seule) et les actions.
export default {
  state: readonly(state),
  ...actions,
};