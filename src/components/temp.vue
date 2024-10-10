<template>
  <div>
    <!-- Display Words -->
    <div v-if="wordsStore.isLoading">Loading words...</div>
    <div v-else-if="wordsStore.errorMessage">
      {{ wordsStore.errorMessage }}
    </div>
    <ul v-else>
      <li v-for="word in wordsStore.words" :key="word.id">
        {{ word.irish }} - {{ word.english }}
      </li>
    </ul>

    <!-- Display Clusters -->
    <div v-if="clustersStore.isLoading">Loading clusters...</div>
    <div v-else-if="clustersStore.errorMessage">
      {{ clustersStore.errorMessage }}
    </div>
    <ul v-else>
      <li v-for="cluster in clustersStore.clusters" :key="cluster.id">
        Cluster ID: {{ cluster.id }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useWordsStore } from "@/stores/words";
import { useClustersStore } from "@/stores/clusters";

// Initialize stores
const wordsStore = useWordsStore();
const clustersStore = useClustersStore();

// Fetch data on component mount
onMounted(() => {
  wordsStore.fetchWords();
  clustersStore.fetchClusters();
});
</script>
