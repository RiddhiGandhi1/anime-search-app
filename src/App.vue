<template>
    <v-app>
        <!-- Navigation -->
        <v-toolbar>
            <v-btn to="/" text>Anime List</v-btn>
            <v-btn to="/favorites" text>Favorites</v-btn>
        </v-toolbar>

        <!-- Main content -->
        <router-view />
    </v-app>
</template>
