<!-- ClusterCatalogItem.vue -->
<template>
  <div v-if="item" class="flex items-center justify-between px-2 py-1">
    <div class="text-xs font-medium text-gray-700">{{ words }}</div>
    <div>
      <router-link :to="{ name: 'ClusterQuiz', params: { id: item.id } }"
        >Go to Cluster Quiz {{ item.id }}</router-link
      >
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