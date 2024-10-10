import { createWord, fetchWords } from "@/services/wordService";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useWordsStore = defineStore("words", () => {
  const words = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref("");

  // In the store
  const getWords = async () => {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      //   const response = await apiClient.get("/words/");
      const response = await fetchWords();
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

  const addWord = async (wordData) => {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      console.log("wordData", wordData);

      const response = await createWord(wordData);
      words.value.push(response.data);
    } catch (error) {
      console.error("Error adding word:", error);
      errorMessage.value = "Failed to add word.";
      throw error; // To handle in the component
    } finally {
      isLoading.value = false;
    }
  };

  return {
    words,
    isLoading,
    errorMessage,
    fetchWords: getWords,
    addWord,
  };
});
