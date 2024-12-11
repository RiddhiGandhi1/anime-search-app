<template>
    <v-row>
        <!-- Filters -->
        <v-col cols="12">
            <!-- Status Tabs -->
            <v-tabs v-model="selectedStatus" show-arrows>
                <v-tab value="1">Airing</v-tab>
                <v-tab value="2">Complete</v-tab>
                <v-tab value="3">Upcoming</v-tab>
                <v-tab value="">All</v-tab>
            </v-tabs>

            <v-row>
                <!-- Search Input -->
                <v-col cols="6">
                    <v-text-field v-model="searchQuery" label="Search Anime" @input="debounceSearch" debounce="500" />
                </v-col>

                <!-- Type Dropdown -->
                <v-col cols="6">
                    <v-select v-model="selectedType" :items="typeOptions" label="Filter by Type" item-value="value"
                        item-text="text" dense />
                </v-col>
            </v-row>
        </v-col>

        <!-- Anime Results -->
        <v-col cols="12">
            <AnimeTable :animeData="animeData" :options="paginationOptions" @update:options="updatePaginationOptions" />
            <AnimeLoader v-if="loading" />
        </v-col>

        <!-- Pagination and Rows per Page -->
        <v-col cols="12" class="d-flex justify-space-between align-center">
            <v-select v-model="paginationOptions.itemsPerPage" :items="[5, 10, 20]" label="Rows per page" dense
                hide-details style="max-width: 150px" />
            <v-pagination v-model="paginationOptions.page" :length="totalPages" :total-visible="5"
                prev-icon="mdi-chevron-left" next-icon="mdi-chevron-right" />
            <div>
                Showing {{ startItem }} - {{ endItem }} of
                {{ paginationOptions.totalItems }}
            </div>
        </v-col>
    </v-row>
</template>

<script>
import AnimeTable from "@/components/AnimeTable.vue";
import AnimeLoader from "@/components/AnimeLoader.vue";
import axios from "axios";

export default {
    name: "HomePage",
    components: {
        AnimeTable,
        AnimeLoader,
    },
    data() {
        return {
            searchQuery: "",
            selectedStatus: "",
            selectedType: "",
            typeOptions: [
                { text: "All", value: "" },
                { text: "TV", value: "tv" },
                { text: "Movie", value: "movie" },
                { text: "OVA", value: "ova" },
                { text: "Special", value: "special" },
                { text: "ONA", value: "ona" },
                { text: "Music", value: "music" },
                { text: "CM", value: "cm" },
                { text: "PV", value: "pv" },
                { text: "TV Special", value: "tv_special" },
            ],
            animeData: [],
            loading: false,
            paginationOptions: {
                page: 1,
                itemsPerPage: 5,
                totalItems: 1,
            },
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(
                this.paginationOptions.totalItems / this.paginationOptions.itemsPerPage
            );
        },
        startItem() {
            return (
                (this.paginationOptions.page - 1) *
                this.paginationOptions.itemsPerPage +
                1
            );
        },
        endItem() {
            return Math.min(
                this.paginationOptions.page * this.paginationOptions.itemsPerPage,
                this.paginationOptions.totalItems
            );
        },
    },
    watch: {
        searchQuery: "fetchAnime",
        selectedStatus: "fetchAnime",
        selectedType: "fetchAnime",
        "paginationOptions.page": "fetchAnime",
        "paginationOptions.itemsPerPage": "fetchAnime",
    },
    mounted() {
        this.fetchAnime();
    },
    methods: {
        debounceSearch() {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.fetchAnime();
            }, 500);
        },
        getStatusForApi() {
            switch (this.selectedStatus) {
                case 0:
                    return "airing";
                case 1:
                    return "complete";
                case 2:
                    return "upcoming";
                default:
                    return undefined;
            }
        },
        async fetchAnime() {
            this.loading = true;

            const params = {
                q: this.searchQuery || undefined,
                page: this.paginationOptions.page || 1,
                limit: this.paginationOptions.itemsPerPage || 5,
                status: this.getStatusForApi(),
                type: this.selectedType || undefined,
            };

            try {
                const response = await axios.get("https://api.jikan.moe/v4/anime", {
                    params,
                });

                this.animeData = response.data.data.map((item) => ({
                    title: item.title,
                    type: item.type,
                    rating: item.rating || "N/A",
                    episodes: item.episodes || "N/A",
                    image: item.images.jpg.image_url,
                    url: item.url,
                }));

                this.paginationOptions.totalItems =
                    response.data.pagination.items.total;
                this.loading = false;
            } catch (error) {
                console.error(
                    "Error fetching anime data:",
                    error.response?.data || error
                );
                this.loading = false;
            }
        },
        updatePaginationOptions(updatedOptions) {
            this.paginationOptions = updatedOptions;
        },
    },
};
</script>
