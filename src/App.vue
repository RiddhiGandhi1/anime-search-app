<template>
  <v-app>
    <v-main>
      <v-container>
        <HomePage />
        <!-- Updated component name -->
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import HomePage from "./views/HomePage.vue"; // Updated to HomePage

export default {
  name: "App",
  components: {
    HomePage, // Updated component name
  },
};
</script>
