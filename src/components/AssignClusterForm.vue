<!-- src/components/AssignClusterForm.vue -->
<template>
  <div v-if="word" class="assign-cluster-form">
    <h2>Reassign "{{ word.irish }}" to a Cluster</h2>

    <!-- Display Current Word Details -->
    <div class="current-word">
      <p><strong>Irish:</strong> {{ word.irish }}</p>
      <p><strong>English:</strong> {{ word.english }}</p>
      <p><strong>Current Cluster ID:</strong> {{ word.cluster_id }}</p>
    </div>

    <!-- Cluster Selection Form -->
    <form @submit.prevent="handleSubmit">
      <label for="cluster-select">Select New Cluster:</label>
      <select id="cluster-select" v-model="selectedClusterId" required>
        <option disabled value="">-- Please choose a cluster --</option>
        <option
          v-for="cluster in clusters"
          :key="cluster.id"
          :value="cluster.id"
        >
          Cluster {{ cluster.id }} ({{
            Object.keys(cluster.cluster).join(", ")
          }})
        </option>
      </select>

      <button type="submit" :disabled="selectedClusterId === word.cluster_id">
        Reassign to Cluster
      </button>
    </form>

    <!-- Success and Error Messages -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"; // Import necessary Vue functions
import apiClient from "@/plugins/axios"; // Import your Axios instance
import { useRouter } from "vue-router"; // Import Vue Router's useRouter

// Props
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

// Reactive state variables
const word = ref(null);
const clusters = ref([]);
const selectedClusterId = ref("");
const successMessage = ref("");
const errorMessage = ref("");
const router = useRouter();

// Fetch the specific word details
const fetchWord = async () => {
  try {
    const response = await apiClient.get(`/words/${props.id}`);
    word.value = response.data;
    selectedClusterId.value = word.value.cluster_id; // Pre-select current cluster
  } catch (error) {
    console.error("Error fetching word:", error);
    errorMessage.value = "Failed to load word details.";
  }
};

// Fetch all clusters
const fetchClusters = async () => {
  try {
    const response = await apiClient.get("/clusters/");
    clusters.value = response.data;
  } catch (error) {
    console.error("Error fetching clusters:", error);
    errorMessage.value = "Failed to load clusters.";
  }
};

// Handle form submission to reassign the word
const handleSubmit = async () => {
  if (
    !confirm(
      "Are you sure you want to reassign this word to the selected cluster?"
    )
  ) {
    return;
  }

  successMessage.value = "";
  errorMessage.value = "";

  if (!selectedClusterId.value) {
    errorMessage.value = "Please select a cluster.";
    return;
  }

  try {
    // Update the word's cluster_id via PUT request
    const updatedWord = await apiClient.put(`/words/${word.value.id}`, {
      cluster_id: selectedClusterId.value,
    });

    successMessage.value = `Word reassigned to Cluster ${updatedWord.data.cluster_id} successfully.`;

    // Optionally, redirect back to the word list after a delay
    setTimeout(() => {
      router.push({ name: "WordList" });
    }, 2000);
  } catch (error) {
    console.error("Error reassigning word:", error);
    errorMessage.value =
      error.response?.data?.detail ||
      "An error occurred while reassigning the word.";
  }
};

// Fetch data when the component is mounted
onMounted(() => {
  fetchWord();
  fetchClusters();
});
</script>

<style scoped>
.assign-cluster-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.current-word {
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
}

select {
  padding: 8px;
  margin-bottom: 15px;
}

button {
  padding: 10px;
  background-color: #f0ad4e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #ec971f;
}

.success-message {
  margin-top: 15px;
  color: green;
}

.error-message {
  margin-top: 15px;
  color: red;
}
</style>
