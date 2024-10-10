// src/stores/clusters.js
import apiClient from "@/plugins/axios"; // Import your Axios instance
import { defineStore } from "pinia";
import { ref } from "vue";

export const useClustersStore = defineStore("clusters", () => {
  // State
  const clusters = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref("");

  // Actions
  const fetchClusters = async () => {
    isLoading.value = true;
    errorMessage.value = "";
    try {
      const response = await apiClient.get("/clusters/");
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
      const response = await apiClient.post("/clusters/", clusterData);
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
    fetchClusters,
  };
});
