import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        favorites: JSON.parse(localStorage.getItem("favorites") || "[]"),
    },
    mutations: {
        addFavorite(state, id) {
            if (!state.favorites.includes(id)) {
                state.favorites.push(id);
                localStorage.setItem("favorites", JSON.stringify(state.favorites));
            }
        },
        removeFavorite(state, id) {
            state.favorites = state.favorites.filter((fav) => fav !== id);
            localStorage.setItem("favorites", JSON.stringify(state.favorites));
        },
    },
    actions: {
        toggleFavorite({ commit, state }, id) {
            if (state.favorites.includes(id)) {
                commit("removeFavorite", id);
            } else {
                commit("addFavorite", id);
            }
        },
    },
});
