import apiClient from "@/plugins/axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useWordsStore = defineStore("words", () => {
  const words = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref("");

  // In the store
  const fetchWords = async () => {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      const response = await apiClient.get("/words/");
      console.log("Fetched words:", response.data); // Log fetched data

      const sortedWords = response.data.sort((a, b) =>
        a.irish.localeCompare(b.irish)
      );

      words.value = sortedWords;
    } catch (error) {
      console.error("Error fetching words:", error);
      errorMessage.value = "Failed to load words";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    words,
    isLoading,
    errorMessage,
    fetchWords,
  };
});
