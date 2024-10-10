<template>
  <!-- Add a loading state -->
  <div v-if="wordsStore.isLoading" class="text-center text-blue-400 mt-5">
    Loading words...
  </div>

  <div v-else-if="wordsStore.errorMessage" class="text-center text-red-500">
    {{ wordsStore.errorMessage }}
  </div>

  <!-- Conditionally display content -->
  <div v-else>
    <div class="max-w-3xl mx-auto p-4 font-sans">
      <h2 class="text-center mb-4 text-xl">All Irish Words</h2>

      <!-- Search Input -->
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by Irish..."
        class="w-full p-2 border border-gray-300 rounded text-sm mb-4"
      />

      <ul>
        <!-- Cluster Words Details -->
        <li v-for="word in filteredWords" :key="word.id" class="flex flex-col">
          <WordListItemCompact
            :word="word"
            :clustersFiltered="filterClusterId !== null"
            @toggleClusterVisibilityClicked="handleToggleClusterVisibilityClick"
            @removeWord="handleRemoveWord"
          />
        </li>
      </ul>

      <div
        v-if="wordsStore.errorMessage"
        class="text-center text-red-500 mt-4 text-sm"
      >
        {{ wordsStore.errorMessage }}
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue"; // Import necessary Vue functions
import WordListItemCompact from "@/components/WordListItemCompact.vue";
import { useWordsStore } from "@/stores/words";
import apiClient from "@/plugins/axios"; // Add this line

const wordsStore = useWordsStore();

// Reactive state variables
// const words = ref([]);
// const clusters = ref([]);
const showDetails = ref({});
const filterClusterId = ref(null);
const searchQuery = ref("");

/**
 * User clicks [show / hide only this cluster].
 * - Set the filterClusterId to the one associated with that word.
 * - Or clear it.
 * @param word
 */
const handleToggleClusterVisibilityClick = (word) => {
  if (word.cluster_id) {
    filterClusterId.value =
      filterClusterId.value === null ? word.cluster_id : null;
  }
};

/**
 * User clicks [remove word]
 * @param id
 */
const handleRemoveWord = async (id) => {
  console.log("remove word with id", id);
  if (
    !confirm("Are you sure you want to remove this word from this cluster?")
  ) {
    return;
  }

  try {
    const response = await apiClient.delete(`/words/${id}`);
    await wordsStore.fetchWords();

    console.log(response);
  } catch (e) {
    console.error(e);
  }
};

/**
 * Filter visible words based on search bar contents
 */
const filteredWords = computed(() => {
  if (wordsStore.words) {
    // Only filter by cluster if they aren't also using the search bar
    if (!searchQuery.value) {
      return wordsStore.words.filter(
        (word) =>
          filterClusterId.value === null ||
          word.cluster_id === filterClusterId.value
      );
    }
    return wordsStore.words.value.filter((word) =>
      word.irish.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  } else {
    return [];
  }
});

// Fetch data when the component is mounted
onMounted(() => {
  wordsStore.fetchWords();

  console.log("wordsStore", wordsStore);
  // console.log("wordsStore.value.words.value", wordsStore.value.words.value);
  console.log("wordsStore.words", wordsStore.words);
  // console.log("wordsStore.words.value", wordsStore.words.value);
});
</script>

<style scoped ></style>
