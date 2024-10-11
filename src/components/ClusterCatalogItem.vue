<!-- ClusterCatalogItem.vue -->
<template>
  <div
    v-if="item"
    class="flex items-center justify-between px-4 py-2 bg-white shadow-md rounded-md"
  >
    <!-- Word Display -->
    <div class="text-sm font-medium text-gray-700">
      {{ words }}
    </div>

    <!-- Router Links Grouped Together -->
    <div class="flex space-x-2">
      <!-- Cluster List Link -->
      <router-link
        :to="{ name: 'ClusterList', params: { id: item.id } }"
        class="inline-block bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600 transition-colors duration-200"
      >
        Audio {{ item.id }}
      </router-link>

      <!-- Cluster Quiz Link -->
      <router-link
        :to="{ name: 'ClusterQuiz', params: { id: item.id } }"
        class="inline-block bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600 transition-colors duration-200"
      >
        Quiz {{ item.id }}
      </router-link>
    </div>
  </div>
</template>



<script setup>
import { computed } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const words = computed(() =>
  props?.item?.cluster
    ? Object.getOwnPropertyNames(props.item.cluster)
        .sort((a, b) => a.localeCompare(b))
        .join(", ")
    : ""
);
</script>
<style scoped>
/* Optional: Additional styles if needed */
</style>