<template>
  <div v-if="word" class="word-info">
    <div class="word-details">
      <span><strong>Irish:</strong> {{ word.irish }}</span>
      <span><strong>English:</strong> {{ word.english }}</span>
      <span><strong>Cluster ID:</strong> {{ word.cluster_id }}</span>
    </div>
    <div class="word-actions">
      <button class="details-button" @click="emitToggleClusterVisibililtyClick">
        {{
          clustersFiltered === false
            ? "Show Only This Cluster"
            : "Show All Clusters"
        }}
      </button>
      <router-link :to="{ name: 'ReassignCluster', params: { id: word.id } }">
        <button class="reassign-button">Reassign</button>
      </router-link>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  word: {
    type: Object,
    required: false,
  },
  clustersFiltered: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits(["toggleClusterVisibilityClicked"]);

const emitToggleClusterVisibililtyClick = () => {
  emits("toggleClusterVisibilityClicked", props.word);
};
</script>
<style scoped>
button {
  background-color: #4caf50; /* Green background */
  border: none; /* Remove borders */
  color: white; /* White text */
  padding: 10px 20px; /* Add some padding */
  text-align: center; /* Center the text */
  text-decoration: none; /* Remove underlines */
  display: inline-block; /* Make the button inline */
  font-size: 16px; /* Increase font size */
  margin: 4px 2px; /* Add some margin */
  cursor: pointer; /* Add a pointer on hover */
  border-radius: 5px; /* Rounded corners */
}

button:hover {
  background-color: #45a049; /* Darker green on hover */
}
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