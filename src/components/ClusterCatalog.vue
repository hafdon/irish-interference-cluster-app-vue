<template>
  <div v-if="isLoading" class="loading-spinner">Loading...</div>

  <div v-else>
    <div>
      <h2>All Clusters</h2>
      <div v-for="cluster in clusters" :key="cluster.id">
        <router-link :to="{ name: 'ClusterList', params: { id: cluster.id } }">
          <ClusterCatalogItem :item="cluster"
        /></router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import apiClient from "@/plugins/axios";

import ClusterCatalogItem from "@/components/ClusterCatalogItem.vue";

const apiClusters = ref([]);
const isLoading = ref(false);

onMounted(() => {
  isLoading.value = true;
  fetchClusters();
});

const fetchClusters = async () => {
  try {
    const response = await apiClient.get("/clusters/");
    console.log(response.data);
    apiClusters.value = response.data;
  } catch (e) {
    console.error("Error fetching clusters:", error);
  } finally {
    isLoading.value = false;
  }
};

const clusters = computed(() => {
  return apiClusters.value ?? [];
});
</script>

<style scoped>
.loading-spinner {
  text-align: center;
  font-size: 1em;
  color: #5bc0de;
  margin-top: 20px;
}
</style>