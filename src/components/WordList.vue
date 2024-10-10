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
        @input="handleSearchInput"
      />
      <!-- Items Per Page Selector -->
      <div class="flex justify-end mb-2">
        <label for="items-per-page" class="text-sm mr-2">Items per page:</label>
        <select
          id="items-per-page"
          v-model.number="itemsPerPage"
          @change="currentPage = 1"
          class="border border-gray-300 rounded p-1 text-sm"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>

      <ul>
        <!-- Cluster Words Details -->
        <li v-for="word in paginatedWords" :key="word.id" class="flex flex-col">
          <WordListItemCompact
            :word="word"
            :clustersFiltered="filterClusterId !== null"
            @toggleClusterVisibilityClicked="handleToggleClusterVisibilityClick"
            @removeWord="handleRemoveWord"
          />
        </li>
      </ul>

      <!-- Pagination Controls with Ellipses -->
      <div
        v-if="totalPages > 1"
        class="flex justify-center items-center mt-6 space-x-2"
      >
        <!-- First Page Button -->
        <button
          @click="firstPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
        >
          « First
        </button>

        <!-- Previous Page Button -->
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
        >
          ‹ Prev
        </button>

        <!-- Ellipses for Left Side -->
        <span v-if="pageNumbers[0] > 1" class="px-2 py-1">...</span>

        <!-- Page Numbers -->
        <button
          v-for="page in pageNumbers"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-3 py-1 rounded-md',
            page === currentPage
              ? 'bg-indigo-500 text-white font-semibold'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          {{ page }}
        </button>

        <!-- Ellipses for Right Side -->
        <span
          v-if="pageNumbers[pageNumbers.length - 1] < totalPages"
          class="px-2 py-1"
          >...</span
        >

        <!-- Next Page Button -->
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
        >
          Next ›
        </button>

        <!-- Last Page Button -->
        <button
          @click="lastPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
        >
          Last »
        </button>
      </div>

      <!-- No Results Found -->
      <div
        v-if="filteredWords.length === 0"
        class="text-center text-red-500 mt-4 text-sm"
      >
        No results found for "{{ searchQuery }}"
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed, watch } from "vue"; // Import necessary Vue functions
import WordListItemCompact from "@/components/WordListItemCompact.vue";
import { useWordsStore } from "@/stores/words";
import apiClient from "@/plugins/axios"; // Add this line
import { debounce } from "lodash";

import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const handleSearchInput = debounce(() => {
  currentPage.value = 1; // Reset to first page on search
}, 300); // 300ms delay

const wordsStore = useWordsStore();

// Reactive state variables
// const words = ref([]);
// const clusters = ref([]);
const showDetails = ref({});
const filterClusterId = ref(null);
const searchQuery = ref("");

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(20);
const totalPages = ref(null);

const scrollToTop = () => {
  const container = document.querySelector(".max-w-3xl");
  if (container) {
    container.scrollIntoView({ behavior: "smooth" });
  }
};

/**
 * User clicks [show / hide only this cluster].
 * - Set the filterClusterId to the one associated with that word.
 * - Or clear it.
 * @param word
 */
const handleToggleClusterVisibilityClick = (word) => {
  if (word.cluster_id) {
    filterClusterId.value =
      filterClusterId.value === word.cluster_id ? null : word.cluster_id;
    currentPage.value = 1; // Reset to first page when filter changes
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
    await apiClient.delete(`/words/${id}`);
    await wordsStore.fetchWords();
    console.log("Word removed successfully.");
  } catch (e) {
    console.error(e);
    // Optionally, handle specific errors here
  }
};

/**
 * Filter visible words based on search bar contents
 */
const filteredWords = computed(() => {
  let filtered = wordsStore.words;

  if (!filtered) return [];

  // Apply cluster filter and search query filter sequentially
  if (filterClusterId.value !== null) {
    filtered = filtered.filter(
      (word) => word.cluster_id === filterClusterId.value
    );
  }

  if (searchQuery.value) {
    filtered = filtered.filter((word) =>
      word.irish.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return filtered;
});

// Total number of items divided by the total items per page, or 1
const computedTotalPages = computed(
  () => Math.ceil(filteredWords.value.length / itemsPerPage.value) || 1
);

// Computed property for page numbers
const pageNumbers = computed(() => {
  const pages = [];
  const maxVisiblePages = 5; // Maximum number of page buttons to display
  let startPage = Math.max(currentPage.value - 2, 1);
  let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages.value);

  // Adjust startPage if we're near the end
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Watch for changes in filteredWords to update totalPages and reset currentPage if necessary
const watchFilteredWords = () => {
  totalPages.value = computedTotalPages.value;

  // If currentPage exceeds totalPages due to filtering, reset to last available page
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
};

// Call watchFilteredWords whenever filteredWords changes
watch(filteredWords, watchFilteredWords);

// Computed property for paginated words
const paginatedWords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredWords.value.slice(start, end);
});

// Function to handle page changes
const goToPage = (pageNumber) => {
  if (pageNumber < 1) {
    currentPage.value = 1;
  } else if (pageNumber > totalPages.value) {
    currentPage.value = totalPages.value;
  } else {
    currentPage.value = pageNumber;
    scrollToTop();
    // Update the URL with the current page
    router.push({ query: { ...route.query, page: pageNumber } });
  }
};

// Function to go to the next page
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    scrollToTop();
  }
};

// Function to go to the previous page
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    scrollToTop();
  }
};

// Function to go to the first page
const firstPage = () => {
  currentPage.value = 1;
  scrollToTop();
};

// Function to go to the last page
const lastPage = () => {
  currentPage.value = totalPages.value;
  scrollToTop();
};

// Fetch data when the component is mounted
onMounted(() => {
  const page = parseInt(route.query.page, 10);
  if (!isNaN(page) && page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
  wordsStore.fetchWords();
  console.log("wordsStore", wordsStore);
});
</script>

<style scoped ></style>
