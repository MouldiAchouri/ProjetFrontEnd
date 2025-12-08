// stores/historyStore.js

import { reactive, readonly, watch } from 'vue'; 

const STORAGE_KEY = 'movieHistory'; 

// 1. Initialisation avec persistance depuis localStorage
const initialList = (() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Erreur lors de la lecture du localStorage pour l'historique:", e);
    return [];
  }
})();

const state = reactive({
  list: initialList,
});

const actions = {
  /**
   * Ajoute le film au DÉBUT de l'historique (Anti-chronologique : le plus récent en premier)
   * Les duplicata sont autorisés.
   * @param {Object} filmData - Les données complètes du film.
   */
  addHistoryEntry(filmData) {
    const newEntry = {
      imdbID: filmData.imdbID,
      Title: filmData.Title,
      Poster: filmData.Poster,
      Year: filmData.Year,
      Type: filmData.Type || 'N/A', 
      viewedAt: Date.now(),
    };

    state.list.unshift(newEntry); 
    
    console.log(`[History] Ajouté en tête : ${newEntry.Title}`); 
    
    // Si l'on souhaite remettre la limite, on enlèverait le dernier élément (le plus ancien)
    /*
    if (state.list.length > 50) { 
      state.list.pop(); 
    }
    */
  },
};

// 2. Surveiller la liste et la sauvegarder à chaque changement dans localStorage
watch(
  state.list, 
  (newList) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  },
  { deep: true } 
);

export default {
  state: readonly(state),
  ...actions,
};