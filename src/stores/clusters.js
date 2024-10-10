// src/stores/clusters.js
import { createCluster, fetchClusters } from "@/services/clusterService";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useClustersStore = defineStore("clusters", () => {
  // State
  const clusters = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref("");

  // Actions
  const getClusters = async () => {
    isLoading.value = true;
    errorMessage.value = "";
    try {
      const response = await fetchClusters();
      console.log(response.data);
      clusters.value = response.data;
    } catch (error) {
      console.error("Error fetching clusters:", error);
      errorMessage.value = "Failed to load clusters.";
    } finally {
      isLoading.value = false;
    }
  };

  const addCluster = async (clusterData) => {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      const response = await createCluster(clusterData);
      clusters.value.push(response.data);
      return response.data; // Return the new cluster for further use
    } catch (error) {
      console.error("Error adding cluster:", error);
      errorMessage.value = "Failed to add cluster.";
      throw error; // To handle in the component
    } finally {
      isLoading.value = false;
    }
  };

  return {
    clusters,
    isLoading,
    errorMessage,
    fetchClusters: getClusters,
    addCluster,
  };
});
