import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import FavoritesPage from '@/views/FavoritesPage.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'HomePage',
            component: HomePage,
        },
        {
            path: '/favorites',
            name: 'FavoritesPage',
            component: FavoritesPage,
        },
    ],
});
