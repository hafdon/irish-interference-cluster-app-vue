<template>
  <div v-if="word" class="word-info">
    <div class="word-details">
      <span><strong>Irish:</strong> {{ word.irish }}</span>
      <span><strong>English:</strong> {{ word.english }}</span>
      <!-- <span><strong>Cluster ID:</strong> {{ word.cluster_id }}</span> -->
    </div>
    <div class="word-actions">
      <button class="details-button" @click="emitToggleClusterVisibililtyClick">
        {{
          clustersFiltered === false
            ? "Show Only This Cluster"
            : "Show All Clusters"
        }}
      </button>
      <router-link
        :to="{ name: 'ReassignCluster', params: { id: word.id } }"
        class="reassign-link"
      >
        Reassign
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
/* General Button Styles */
button,
.reassign-link {
  background-color: #4caf50; /* Default Green background */
  border: none; /* Remove borders */
  color: white; /* White text */
  padding: 10px 20px; /* Consistent padding */
  text-align: center; /* Center the text */
  text-decoration: none; /* Remove underlines for links */
  display: inline-flex; /* Use inline-flex for better alignment */
  align-items: center; /* Vertically center content */
  justify-content: center; /* Horizontally center content */
  font-size: 16px; /* Consistent font size */
  cursor: pointer; /* Pointer cursor on hover */
  border-radius: 5px; /* Rounded corners */
  min-width: 150px; /* Ensures buttons don't shrink below this width */
  box-sizing: border-box; /* Includes padding and border in the element's total width and height */
  white-space: nowrap; /* Prevents text from wrapping */
  overflow: hidden; /* Hides overflow text */
  text-overflow: ellipsis; /* Adds ellipsis for overflowing text */
}

/* Specific Button Styles */
.reassign-link {
  background-color: #f0ad4e;
  color: white;
}

.reassign-link:hover {
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

/* Container Styles */
.word-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap; /* Prevent wrapping to maintain layout stability */
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
}

/* Word Details Styles */
.word-details {
  display: flex;
  gap: 20px; /* Increased space between details for better readability */
  flex: 1; /* Allows word-details to take available space */
  min-width: 300px; /* Ensures word-details doesn't shrink too much */
  font-size: 0.95em; /* Slightly larger font for better readability */
}

.word-details span {
  display: flex;
  align-items: center;
  max-width: 250px; /* Limits the width of each detail to prevent overflow */
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Word Actions Styles */
.word-actions {
  display: flex;
  gap: 15px; /* Increased space between buttons */
  flex-shrink: 0; /* Prevents actions from shrinking */
}

.reassign-link {
  /* Inherit button styles */
}

/* Responsive Adjustments */
@media (max-width: 800px) {
  .word-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .word-details {
    gap: 10px;
    min-width: 100%;
  }

  .word-actions {
    width: 100%;
    justify-content: flex-start;
  }

  button,
  .reassign-link {
    width: 48%; /* Allows two buttons to sit side by side with some gap */
    min-width: unset; /* Removes min-width on smaller screens */
  }
}

@media (max-width: 500px) {
  .word-details {
    flex-direction: column;
    gap: 8px;
  }

  button,
  .reassign-link {
    width: 100%; /* Full width buttons on very small screens */
  }
}
</style>
