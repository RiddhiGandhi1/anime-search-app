<template>
    <v-row justify="center">
        <v-col cols="12" md="8">
            <v-card class="pa-4 mt-5" elevation="2">
                <h2 class="mb-4 text-center">Your Favorite Animes</h2>
                <v-row>
                    <v-col v-for="(anime, index) in favorites" :key="index" cols="12" md="6" lg="4">
                        <v-card class="anime-card" outlined>
                            <v-img :src="anime.image" height="200px" class="anime-image"></v-img>
                            <v-card-title class="title">
                                {{ anime.title }}
                            </v-card-title>
                            <v-card-actions class="justify-space-between">
                                <v-btn @click="removeFavorite(anime)" color="red" text>
                                    <v-icon left>mdi-heart-off</v-icon> Remove
                                </v-btn>
                                <v-btn :href="anime.url" target="_blank" color="primary" text>
                                    <v-icon left>mdi-eye</v-icon> View
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row v-if="favorites.length === 0" justify="center">
                    <v-col cols="12" class="text-center">
                        <v-icon size="48" color="grey">mdi-emoticon-sad-outline</v-icon>
                        <p class="grey--text text--darken-2">You haven't added any favorites yet.</p>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: "FavoritesPage",
    data() {
        return {
            favorites: [],
        };
    },
    mounted() {
        this.loadFavorites();
    },
    methods: {
        loadFavorites() {
            this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        },

        removeFavorite(anime) {
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favorites = favorites.filter(fav => fav.url !== anime.url);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            this.loadFavorites();
        },
    },
};
</script>

<style scoped>
.anime-card {
    transition: transform 0.3s;
    cursor: pointer;
}

.anime-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
}

.anime-image {
    border-bottom: 2px solid #3f51b5;
}

.title {
    font-weight: bold;
    font-size: 18px;
    color: #333;
    text-align: center;
}

.v-btn {
    text-transform: none;
    font-weight: bold;
}
</style>
