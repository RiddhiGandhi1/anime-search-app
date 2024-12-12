<template>
    <v-data-table hide-default-footer disable-pagination :items="animeDataWithFavorites" :headers="headers"
        :loading="loading">

        <!-- Image Slot -->
        <template v-slot:[`item.image`]="{ item }">
            <v-img :src="item.image" class="rounded-circle mt-2 mb-2" max-height="50" max-width="50" />
        </template>

        <!-- Title Slot -->
        <template v-slot:[`item.url`]="{ item }">
            <a :href="item.url" target="_blank" rel="noopener noreferrer">
                {{ item.title }}
            </a>
        </template>

        <!-- Status Slot -->
        <template v-slot:[`item.status`]="{ item }">
            <v-chip :color="getStatusColor(item.status).color" :text-color="getStatusColor(item.status).text">
                {{ getStatusText(item.status) }}
            </v-chip>
        </template>

        <!-- Favorite Slot -->
        <template v-slot:[`item.favorite`]="{ item }">
            <v-btn @click="toggleFavorite(item)" :color="isFavorite(item) ? 'red' : 'grey'" icon>
                <v-icon>mdi-heart</v-icon>
            </v-btn>
        </template>

    </v-data-table>
</template>

<script>
export default {
    props: {
        animeData: Array,
        loading: Boolean,
    },
    data() {
        return {
            headers: [
                { text: "Image", value: "image", sortable: false },
                { text: "Title", value: "url" },
                { text: "Type", value: "type", sortable: false },
                { text: "Rating", value: "rating" },
                { text: "Status", value: "status", sortable: false },
                { text: "Favorite", value: "favorite", align: "center", sortable: false },
            ],
            localAnimeData: []
        };
    },
    computed: {
        animeDataWithFavorites() {
            return this.localAnimeData.length ? this.localAnimeData : this.animeData;
        }
    },
    watch: {
        animeData: {
            handler(newData) {
                this.localAnimeData = [...newData];
                this.loadFavorites();
            },
            immediate: true
        }
    },
    methods: {
        getStatusText(status) {
            switch (status) {
                case 0:
                    return "Upcoming";
                case "Currently Airing":
                    return "Airing";
                case "Finished Airing":
                    return "Complete";
                default:
                    return "Upcoming";
            }
        },
        getStatusColor(status) {
            switch (status) {
                case 0:
                    return { color: "#fdeccb", text: "orange" };
                case "Currently Airing":
                    return { color: "#fdcdcb", text: "red" };
                case "Finished Airing":
                    return { color: "#cffdcb", text: "green" };
                default:
                    return { color: "#fdeccb", text: "orange" };
            }
        },
        toggleFavorite(anime) {
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

            if (this.isFavorite(anime)) {
                favorites = favorites.filter(fav => fav.url !== anime.url); // Remove from favorites
            } else {
                favorites.push(anime);
            }

            localStorage.setItem('favorites', JSON.stringify(favorites));

            this.localAnimeData = this.localAnimeData.map(item => {
                if (item.url === anime.url) {
                    item.isFavorite = !item.isFavorite;
                }
                return item;
            });

            this.localAnimeData = [...this.localAnimeData];
        },
        isFavorite(anime) {
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            return favorites.some(fav => fav.url === anime.url);
        },
        loadFavorites() {
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

            this.animeData.forEach(anime => {
                anime.isFavorite = favorites.some(fav => fav.url === anime.url);
            });
        }
    },
};
</script>
