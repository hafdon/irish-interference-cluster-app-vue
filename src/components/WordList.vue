<template>
  <!-- Add a loading state -->
  <div v-if="isLoading" class="loading-spinner">Loading...</div>

  <!-- Modify the existing template to conditionally display content -->
  <div v-else>
    <div class="word-list">
      <h2>All Irish Words</h2>
      <!-- Add a search input -->
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by Irish or English..."
        class="search-input"
      />

      <ul>
        <li v-for="word in filteredWords" :key="word.id" class="word-item">
          <!-- Cluster Words Details -->
          <WordListItem
            :word="word"
            :clustersFiltered="filterClusterId !== null"
            @toggleClusterVisibilityClicked="handleToggleClusterVisibilityClick"
          />
        </li>
      </ul>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue"; // Import necessary Vue functions
import apiClient from "@/plugins/axios"; // Import your Axios instance
import WordListItem from "@/components/WordListItem.vue";

// Reactive state variables
const words = ref([]);
const clusters = ref([]);
const errorMessage = ref("");
const showDetails = ref({});

const isLoading = ref(true);

const filterClusterId = ref(null);

const handleToggleClusterVisibilityClick = (word) => {
  console.log(word);
  const clusterId = word.cluster_id;
  if (clusterId) {
    filterClusterId.value = filterClusterId.value === null ? clusterId : null;
  }
};

const fetchWords = async () => {
  try {
    const response = await apiClient.get("/words/");
    words.value = response.data;
  } catch (error) {
    console.error("Error fetching words:", error);
    errorMessage.value = "Failed to load words.";
  } finally {
    isLoading.value = false;
  }
};

const fetchClusters = async () => {
  try {
    const response = await apiClient.get("/clusters/");
    clusters.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching clusters:", error);
    errorMessage.value = "Failed to load clusters.";
  }
};

const searchQuery = ref("");

const filteredWords = computed(() => {
  // Only filter by cluster if they aren't also using the search bar
  if (!searchQuery.value) {
    return words.value.filter(
      (word) =>
        filterClusterId.value === null ||
        word.cluster_id === filterClusterId.value
    );
  }
  return words.value.filter(
    (word) =>
      word.irish.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      word.english.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Toggle the display of cluster details
const toggleClusterDetails = (clusterId) => {
  showDetails.value[clusterId] = !showDetails.value[clusterId];
};

// Get words belonging to a specific cluster
const getClusterWords = (clusterId) => {
  const cluster = clusters.value.find((c) => c.id === clusterId);
  return cluster ? cluster.words : [];
};

// Fetch data when the component is mounted
onMounted(() => {
  fetchWords();
  fetchClusters();
});
</script>

<style scoped >
.word-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 15px; /* Reduced padding */
  font-family: Arial, sans-serif;
}

.word-list h2 {
  text-align: center;
  margin-bottom: 15px; /* Reduced margin */
  font-size: 1.5em;
}

.word-item {
  border: 1px solid #ddd;
  padding: 10px; /* Reduced padding */
  margin-bottom: 8px; /* Reduced margin */
  border-radius: 4px;
  background-color: #f9f9f9;
}

.word-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* Allows wrapping on smaller screens */
}

.word-details {
  display: flex;
  gap: 15px; /* Space between details */
  flex-wrap: wrap;
  font-size: 0.9em; /* Slightly smaller font */
}

.word-details span {
  display: flex;
  align-items: center;
}

.word-actions {
  display: flex;
  gap: 10px; /* Space between buttons */
  margin-top: 5px; /* Reduced top margin */
}

.reassign-button,
.details-button {
  padding: 6px 10px; /* Reduced padding */
  font-size: 0.85em; /* Smaller font */
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.reassign-button {
  background-color: #f0ad4e;
  color: white;
}

.reassign-button:hover {
  background-color: #ec971f;
}

.details-button {
  background-color: #5bc0de;
  color: white;
}

.details-button:hover {
  background-color: #31b0d5;
}

.details-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.cluster-words {
  margin-top: 10px;
  padding-left: 20px;
  border-left: 2px solid #f0ad4e;
  font-size: 0.85em; /* Smaller font */
}

.no-cluster {
  margin-top: 10px;
  padding-left: 20px;
  color: #d9534f;
  font-size: 0.85em; /* Smaller font */
}

.error-message {
  color: red;
  margin-top: 15px; /* Reduced top margin */
  text-align: center;
  font-size: 0.9em;
}

/* Responsive Adjustments */
@media (max-width: 600px) {
  .word-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .word-actions {
    margin-top: 10px;
  }
}

.loading-spinner {
  text-align: center;
  font-size: 1em;
  color: #5bc0de;
  margin-top: 20px;
}

.search-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>
