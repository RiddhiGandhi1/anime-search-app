<template>
  <v-data-table
    hide-default-footer
    disable-pagination
    :headers="headers"
    :items="animeData"
    :loading="loading"
    item-value="id"
  >
    <template v-slot:[`item.image`]="{ item }">
      <v-img :src="item.image" max-height="100" max-width="100" />
    </template>

    <template v-slot:[`item.url`]="{ item }">
      <a :href="item.url" target="_blank" rel="noopener noreferrer">
        {{ item.title }}
      </a>
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
        { text: "Image", value: "image" },
        { text: "Title", value: "url" },
        { text: "Type", value: "type" },
        { text: "Rating", value: "rating" },
        { text: "Episodes", value: "episodes" },
      ],
    };
  },
};
</script>
