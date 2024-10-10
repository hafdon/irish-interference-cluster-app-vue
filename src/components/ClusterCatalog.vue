<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <!-- Loading State -->
    <LoadingSpinner v-if="clustersStore.isLoading" />

    <!-- Content -->
    <div v-else>
      <div class="max-w-4xl mx-auto bg-white shadow rounded-lg">
        <!-- Header -->
        <h2 class="text-lg font-semibold text-gray-800 px-4 py-2 border-b">
          All Clusters
        </h2>

        <!-- Cluster List -->
        <ul class="divide-y divide-gray-200">
          <li v-for="cluster in clusters" :key="cluster.id">
            <router-link
              :to="{ name: 'ClusterList', params: { id: cluster.id } }"
              class="block hover:bg-gray-50 transition-colors duration-200"
            >
              <ClusterCatalogItem :item="cluster" />
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted, computed } from "vue";
import ClusterCatalogItem from "@/components/ClusterCatalogItem.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useClustersStore } from "@/stores/clusters";

const clustersStore = useClustersStore();

onMounted(() => {
  clustersStore.fetchClusters();
});

const clusters = computed(() => {
  return clustersStore.clusters ?? [];
});
</script>
  
  <style scoped>
/* Optional: Additional styles if needed */
</style>
  