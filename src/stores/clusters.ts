// src/stores/clusters.js
import { createCluster, fetchClusters } from "@/services/clusterService";
import { defineStore } from "pinia";
import type { Ref } from 'vue';
import { ref } from "vue";

// Define interfaces for data structures
interface Cluster {
  id: number | string,
  cluster: Record<string, string>
}

interface Word {
  irish: string
  english: string
  id: number
  cluster_id: number | string
  audio: {
    Connacht: boolean
    Munster: boolean
    Ulster: boolean
  }
}

// Define interfaces for API responses
interface FetchClustersResponse {
  data: Cluster[]
}

interface CreateClusterResponse {
  data: Cluster
}

export const useClustersStore = defineStore("clusters", () => {
  // State
  const clusters: Ref<Cluster[]> = ref([]);
  const isLoading: Ref<boolean> = ref(false);
  const errorMessage: Ref<string> = ref("");

  // Actions
  const loadClusters = async (): Promise<void> => {
    isLoading.value = true;
    errorMessage.value = "";
    try {
      const response = (await fetchClusters()) as FetchClustersResponse;
      console.log(response.data);
      clusters.value = response.data;
    } catch (error) {
      console.error("Error fetching clusters:", error);
      errorMessage.value = "Failed to load clusters.";
    } finally {
      isLoading.value = false;
    }
  };

  const addCluster = async (clusterData: any): Promise<Cluster> => {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      const response = (await createCluster(clusterData)) as CreateClusterResponse;
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

  const wordsInSameCluster = (clusterId: number | string): Word[] => {

    // Guard clause
    if (!clusterId) return [];

    // const cluster = clusters.value.filter(
    //   (cluster) => cluster.id == clusterId
    // )?.[0]; 

    const cluster = clusters.value.find(cluster => cluster.id == clusterId)

    // Guard clause
    if (!cluster) return [];

    const words = Object.getOwnPropertyNames(cluster.cluster);

    const result: Word[] = words.map((el, idx) => ({
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
    fetchClusters: loadClusters,
    addCluster,
    wordsInSameCluster,
  };
});
