<template>
    <v-container fluid>
        <v-row>
            <!-- Filters -->
            <v-col cols="12">
                <!-- Status Tabs -->
                <v-tabs v-model="selectedStatus" show-arrows color="indigo" slider-color="orange">
                    <v-tab value="">All</v-tab>
                    <v-tab value="1">Airing</v-tab>
                    <v-tab value="2">Complete</v-tab>
                    <v-tab value="3">Upcoming</v-tab>
                </v-tabs>

                <v-row class="my-4">
                    <!-- Search Input -->
                    <v-col cols="6">
                        <v-text-field v-model="searchQuery" label="Search Anime" @input="debounceSearch" debounce="500"
                            color="indigo" outlined dense />
                    </v-col>

                    <!-- Type Dropdown -->
                    <v-col cols="6">
                        <v-select v-model="selectedType" :items="typeOptions" label="Filter by Type" item-value="value"
                            item-text="text" color="indigo" dense outlined />
                    </v-col>
                </v-row>
            </v-col>

            <!-- Applied Filters -->
            <v-col cols="12" v-if="hasFilters">
                <div class="applied-filters">
                    <span v-if="searchQuery" class="filter-chip">
                        Search: {{ searchQuery }}
                        <v-icon small class="remove-icon" @click="removeFilter('searchQuery')">mdi-close-circle</v-icon>
                    </span>

                    <span v-if="selectedStatus" class="filter-chip">
                        Status: {{ getStatusDisplay() }}
                        <v-icon small class="remove-icon"
                            @click="removeFilter('selectedStatus')">mdi-close-circle</v-icon>
                    </span>

                    <span v-if="selectedType" class="filter-chip">
                        Type: {{ getTypeDisplay() }}
                        <v-icon small class="remove-icon"
                            @click="removeFilter('selectedType')">mdi-close-circle</v-icon>
                    </span>

                    <v-btn text small color="error" @click="clearAllFilters">Clear All Filters</v-btn>
                </div>
            </v-col>

            <!-- Anime Results -->
            <v-col cols="12">
                <AnimeTable :animeData="animeData" :options="paginationOptions"
                    @update:options="updatePaginationOptions" />
                <AnimeLoader v-if="loading" />
            </v-col>

            <!-- Pagination and Rows per Page -->
            <v-col cols="12" class="d-flex justify-space-between align-center mt-4">
                <v-select v-model="paginationOptions.itemsPerPage" :items="[5, 10, 20]" label="Rows per page" dense
                    hide-details style="max-width: 150px" color="indigo" />
                <v-pagination v-model="paginationOptions.page" :length="totalPages" :total-visible="5"
                    prev-icon="mdi-chevron-left" next-icon="mdi-chevron-right" color="indigo" />
                <div>
                    Showing {{ startItem }} - {{ endItem }} of
                    {{ paginationOptions.totalItems }}
                </div>
            </v-col>
        </v-row>
    </v-container>
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
        hasFilters() {
            return this.searchQuery || this.selectedStatus || this.selectedType;
        },
    },
    watch: {
        searchQuery() {
            this.paginationOptions.page = 1;
            this.fetchAnime();
        },
        selectedStatus() {
            this.paginationOptions.page = 1;
            this.fetchAnime();
        },
        selectedType() {
            this.paginationOptions.page = 1;
            this.fetchAnime();
        },
        "paginationOptions.page"() {
            if (this.paginationOptions.page > this.totalPages) {
                this.paginationOptions.page = 1;
            }
            this.fetchAnime();
        },
        "paginationOptions.itemsPerPage"() {
            this.paginationOptions.page = 1;
            this.fetchAnime();
        },
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
            if (!this.selectedStatus) {
                return undefined;
            }

            switch (this.selectedStatus) {
                case 0:
                    return undefined;
                case 1:
                    return "airing";
                case 2:
                    return "complete";
                default:
                    return "upcoming";
            }
        },
        getStatusDisplay() {
            switch (this.selectedStatus) {
                case 0:
                    return "All";
                case 1:
                    return "Airing";
                case 2:
                    return "Complete";
                default:
                    return "Upcoming";
            }
        },
        getTypeDisplay() {
            const type = this.typeOptions.find(option => option.value === this.selectedType);
            return type ? type.text : "";
        },
        async fetchAnime() {
            this.loading = true;

            const params = {
                q: this.searchQuery || undefined,
                page: this.paginationOptions.page || 1,
                limit: this.paginationOptions.itemsPerPage || 5,
                status: this.getStatusForApi(),
                type: this.selectedType || undefined,
                sort: this.searchQuery || this.selectedStatus || this.selectedType ? undefined : "desc",
            };

            try {
                const response = await axios.get("https://api.jikan.moe/v4/anime", {
                    params,
                });

                this.animeData = response.data.data.map((item) => ({
                    title: item.title,
                    type: item.type,
                    rating: item.rating || "N/A",
                    status: item.status || "N/A",
                    image: item.images.jpg.image_url,
                    url: item.url,
                    episodes: item.episodes
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
        removeFilter(filter) {
            this[filter] = "";
        },
        clearAllFilters() {
            this.searchQuery = "";
            this.selectedStatus = "";
            this.selectedType = "";
            this.fetchAnime();
        }
    },
};
</script>

<style scoped>
.applied-filters {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

.filter-chip {
    background-color: #f1f1f1;
    border-radius: 20px;
    padding: 6px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
}

.remove-icon {
    cursor: pointer;
    color: #ff5252;
}

.filter-chip:hover {
    background-color: #eeeeee;
    transform: scale(1.05);
}

.v-btn {
    font-weight: 600;
    font-size: 14px;
}

.v-select {
    font-size: 14px;
}
</style>
