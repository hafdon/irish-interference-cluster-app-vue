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

  const wordsInSameCluster = (clusterId) => {
    console.log("wordsInSameCluster", clusterId);

    // guard
    if (!clusterId) return [];

    const cluster = clusters.value.filter(
      (cluster) => cluster.id == clusterId
    )?.[0]; // TODO is it a string or a number

    if (!cluster) return [];

    const words = Object.getOwnPropertyNames(cluster.cluster);

    const result = words.map((el, idx) => ({
      irish: el,
      english: cluster.cluster[el],
      id: idx + 1, // TODO This is just a fake index for now, won't connect to word in backend
      cluster_id: clusterId,
      audio: {
        Connacht: true, // Assume audio is available initially
        Munster: true,
        Ulster: true,
      },
    }));

    console.log("wordsInSameCluster returning", result);
    return result;
  };

  return {
    clusters,
    isLoading,
    errorMessage,
    fetchClusters: getClusters,
    addCluster,
    wordsInSameCluster,
  };
});
