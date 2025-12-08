// stores/favoritesStore.js

import { reactive, readonly } from 'vue';

// L'état réactif qui contiendra les films favoris.
// Un tableau d'objets (chaque objet est un film).
const state = reactive({
  list: [],
});

// Les actions (méthodes pour modifier l'état).
const actions = {
  /**
   * Ajoute ou supprime un film de la liste des favoris.
   * @param {Object} film - L'objet film à ajouter/supprimer.
   */
  toggleFavorite(film) {
    // Vérifie si le film est déjà présent en utilisant son ID IMDb.
    const index = state.list.findIndex(f => f.imdbID === film.imdbID);

    if (index !== -1) {
      // Si trouvé, le supprime (retrait des favoris).
      state.list.splice(index, 1);
      console.log(`Film supprimé des favoris : ${film.Title}`);
    } else {
      // S'il n'est pas trouvé, l'ajoute (ajout aux favoris).
      state.list.push(film);
      console.log(`Film ajouté aux favoris : ${film.Title}`);
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

// Exporte l'état (en lecture seule pour éviter les modifications directes) et les actions.
export default {
  state: readonly(state), // 'readonly' empêche la modification directe de 'list' en dehors des actions.
  ...actions,
};