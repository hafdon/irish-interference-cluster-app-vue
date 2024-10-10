<template>
  <div class="max-w-md mx-auto p-4 bg-white shadow rounded-lg">
    <h3 class="text-lg font-semibold mb-4">Add a New Word</h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Word Input -->
      <div>
        <label for="word" class="block text-sm font-medium text-gray-700"
          >Word</label
        >
        <input
          type="text"
          id="word"
          v-model="word"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="Enter the word"
        />
      </div>
      <div>
        <label for="meaning" class="block text-sm font-medium text-gray-700"
          >Meaning</label
        >
        <input
          type="text"
          id="meaning"
          v-model="meaningModel"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="Enter the meaning"
        />
      </div>

      <!-- Cluster Selection -->
      <div>
        <span class="block text-sm font-medium text-gray-700"
          >Add to Cluster</span
        >
        <div class="mt-1 space-y-2">
          <label class="inline-flex items-center">
            <input
              type="radio"
              name="clusterOption"
              value="existing"
              v-model="clusterOption"
              class="form-radio text-blue-600"
              @change="toggleClusterOption"
            />
            <span class="ml-2">Add to Existing Cluster</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              name="clusterOption"
              value="new"
              v-model="clusterOption"
              class="form-radio text-blue-600"
              @change="toggleClusterOption"
            />
            <span class="ml-2">Add to New Cluster</span>
          </label>
        </div>
      </div>

      <!-- Existing Cluster Dropdown -->
      <div v-if="clusterOption === 'existing'">
        <label
          for="existingCluster"
          class="block text-sm font-medium text-gray-700"
          >Select Cluster</label
        >
        <select
          id="existingCluster"
          v-model="selectedClusterId"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option disabled value="">Please select one</option>
          <option
            v-for="cluster in clusters"
            :key="cluster.id"
            :value="cluster.id"
          >
            {{ cluster.text }}
          </option>
        </select>
      </div>

      <!-- New Cluster Input -->
      <div v-if="clusterOption === 'new'">
        <label for="newCluster" class="block text-sm font-medium text-gray-700"
          >New Cluster Name</label
        >
        <input
          type="text"
          id="newCluster"
          v-model="newClusterName"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="Enter new cluster name"
        />
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="text-red-500 text-sm">
        {{ errorMessage }}
      </div>

      <!-- Submit Button -->
      <div>
        <button
          type="submit"
          :disabled="clustersStore.isLoading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {{ clustersStore.isLoading ? "Adding..." : "Add Word" }}
        </button>
      </div>
    </form>
  </div>
</template>
  
  <script setup>
import { ref, computed, onMounted } from "vue";
import { useWordsStore } from "@/stores/words";
import { useClustersStore } from "@/stores/clusters";

const wordsStore = useWordsStore();
const clustersStore = useClustersStore();

// Form state
const word = ref("");
const meaningModel = ref("");
const clusterOption = ref("existing"); // 'existing' or 'new'
const selectedClusterId = ref("");
const newClusterName = ref("");
const errorMessage = ref("");

// Fetch existing clusters on mount
onMounted(() => {
  clustersStore.fetchClusters();
});

// Computed property for clusters
const clusters = computed(() => {
  const data = clustersStore.clusters.map((el) => ({
    id: el.id,
    text: Object.getOwnPropertyNames(el.cluster).join(", "),
  }));
  console.log(data);
  return data;
});

// Toggle Cluster Option
const toggleClusterOption = () => {
  if (clusterOption.value === "existing") {
    newClusterName.value = "";
  } else if (clusterOption.value === "new") {
    selectedClusterId.value = "";
  }
};

// Handle form submission
const handleSubmit = async () => {
  console.log("handle submit");
  errorMessage.value = "";

  // Validate word input
  if (!word.value.trim()) {
    errorMessage.value = "Please enter a word.";
    return;
  }

  try {
    // Add new word
    await wordsStore.addWord({
      irish: word.value.trim(),
      english: meaningModel.value.trim(), // Optional
      cluster_id: selectedClusterId.value, // Optional
    });

    // Reset form
    resetForm();
    await clustersStore.fetchClusters();

    // Optionally, display a success message or perform additional actions
  } catch (error) {
    // Handle errors from store actions
    errorMessage.value =
      wordsStore.errorMessage ||
      clustersStore.errorMessage ||
      "An error occurred.";
  }
};

const resetForm = () => {
  // Reset form
  word.value = "";
  meaningModel.value = "";
  selectedClusterId.value = "";
  newClusterName.value = "";
  clusterOption.value = "existing";
};
</script>
  
  <style scoped>
/* Optional: Additional styles if needed */
</style>
  