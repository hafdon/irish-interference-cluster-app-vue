<template>
  <div class="mi-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white shadow-lg rounded-lg p-4 w-full max-w-5xl">
      <h1 class="text-2xl font-bold mb-4 text-center text-indigo-600">
        Irish Word Audio Player
      </h1>

      <form @submit.prevent="searchWord" class="mb-6">
        <vue3-simple-typeahead
          id="typeahead_id"
          placeholder="Enter an Irish word"
          :items="allWords"
          :min-input-length="1"
          :item-projection="itemProjectionFunction"
          @select-item="handleSelect"
          @on-input="handleInput"
          @on-focus="handleFocus"
          @on-blur="handleBlur"
          class="w-full"
          v-model="simpleTypeaheadModel"
        >
          <template #list-header>
            <div class="px-3 py-1 text-indigo-500 font-semibold">
              Suggestions
            </div>
          </template>
          <template #list-item-text="slot">
            <span v-html="highlightMatch(slot.item)"></span>
          </template>
          <template #list-footer>
            <div class="px-3 py-1 text-gray-500">End of Suggestions</div>
          </template>
        </vue3-simple-typeahead>
        <button
          type="submit"
          class="mt-2 w-full bg-indigo-500 text-white py-1 px-3 rounded hover:bg-indigo-600 transition-colors text-sm"
        >
          Search
        </button>
      </form>

      <div v-if="clusterId">
        <h2 class="text-xl font-semibold mb-4 text-center">
          {{
            simpleTypeaheadModel
              ? `Audio Options for Cluster Containing "${inputWord}"`
              : "Cluster"
          }}
        </h2>

        <div class="space-y-2">
          <ClusterListItem
            v-for="item in wordsInSameCluster"
            :key="item.id"
            :item="item"
            @audioFailure="(ev) => handleAudioFailure(ev, item)"
            @removeWord="handleRemoveWord"
          />
        </div>
      </div>

      <div v-else-if="searched" class="text-center">
        <p class="text-red-500 text-sm">
          No results found for "{{ inputWord }}"
        </p>
      </div>

      <div class="py-2">
        <router-link
          :to="{ name: 'ClusterQuiz', params: { id: clusterId } }"
          class="block bg-gray-500 text-center shadow-md font-semibold text-white px-2 py-1 rounded-md hover:bg-gray-600 transition-colors duration-200"
        >
          Cluster Quiz
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import ClusterListItem from "@/components/ClusterListItem.vue";
import apiClient from "@/plugins/axios"; // Import your Axios instance
import { useWordsStore } from "@/stores/words";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router"; // Import useRoute and useRouter
import { useToast } from "vue-toastification"; // Import useToast
const wordsStore = useWordsStore();

// Initialize toast
const toast = useToast();

// Initialize router and route
const router = useRouter();
const route = useRoute();

// State variables
const inputWord = ref("");
const searched = ref(false); // Not sure how this gets used; it is never modified
const apiDataAllWords = ref([]);

const props = defineProps({
  // router parameter
  id: { type: String, required: false },
});

const clusterId = ref(props.id);
const simpleTypeaheadModel = ref("");

// Watch for changes in the prop and update the ref accordingly
// Watch the `clusterId` ref for changes
watch(clusterId, (newValue, oldValue) => {
  console.log(`clusterId changed from "${oldValue}" to "${newValue}"`);

  // Only navigate if the newValue is different and not null/undefined
  if (newValue && newValue !== route.params.id) {
    // Navigate to the same route with the updated 'id' parameter
    router
      .push({
        name: route.name, // Assumes the route has a name
        params: { ...route.params, id: newValue },
        query: route.query, // Preserve existing query parameters
      })
      .catch((err) => {
        // Handle NavigationDuplicated error if navigating to the same route
        if (err.name !== "NavigationDuplicated") {
          console.error("Navigation error:", err);
        }
      });
  }
});

const handleAudioFailure = (region, item) => {
  if (region in item?.audio) {
    item.audio[region] = false;
  }
};

/**
 * User clicks [remove word]
 * @param id
 */
const handleRemoveWord = async (item) => {
  console.log("remove word with id", item.id);
  if (
    !confirm("Are you sure you want to remove this word from this cluster?")
  ) {
    return;
  }

  try {
    const response = await apiClient.delete(`/words/${item.id}`);
    await wordsStore.fetchWords();

    console.log(response);
  } catch (e) {
    console.error(e);
  }
};

// Fetch all words on initial load for autocomplete
// Word is in JSON format:
/**
 * {
 *      "irish": "aodh",
 *      "english": "inflammation",
 *      "cluster_id": null,
 *      "id": 3
 *  }
 **/
const fetchAllWords = async () => {
  try {
    const response = await apiClient.get(`/words/`); // Now run locally!
    apiDataAllWords.value = response.data;
  } catch (error) {
    console.error("Error fetching all words for autocomplete:", error);
  }
};

// computed list of all words for search autocomplete
const allWords = computed(() => {
  const wordSet = new Set(apiDataAllWords.value.map(({ irish }) => irish));
  const results = Array.from(wordSet).sort();
  if (!results.length) {
    // TODO tell user that their word couldn't be found; offer to save in a cluster
    return [];
  }
  return results;
});

// Initialize allWords on component mount
onMounted(() => {
  fetchAllWords();
});

// Autocomplete Handlers
const handleInput = (event) => {
  // You can handle input events if needed
  console.log(event);
  if (event.input === "") {
    console.log("setting clusterId to null");
    clusterId.value = null;
  }
};

// Set the v-model of the typeahead
// (This causes automatic searching)
const handleSelect = (selectedItem) => {
  inputWord.value = selectedItem.trim().toLowerCase();

  const matchingWordObject = apiDataAllWords.value.filter(
    (wordObj) => wordObj.irish.trim().toLowerCase() === inputWord.value
  );

  if (matchingWordObject.length) {
    console.log(matchingWordObject[0]);
    clusterId.value = matchingWordObject[0].cluster_id;
  }
};

const handleFocus = (event) => {
  // Handle focus if needed
};

const handleBlur = (event) => {
  // Handle blur if needed
};

// Projection function for typeahead
const itemProjectionFunction = (item) => {
  return item;
};

// Function to highlight matched text
const highlightMatch = (item) => {
  const query = inputWord.value.trim().toLowerCase();
  if (!query) return item;

  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
  return item.replace(regex, "<strong>$1</strong>");
};

// Utility function to escape RegExp special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Return all words matching the clusterId, or []
 */
const wordsInSameCluster = computed(() => {
  console.log("computed wordsInSameCluster", clusterId.value);
  return clusterId.value
    ? apiDataAllWords.value
        .filter((wordObj) => wordObj.cluster_id == clusterId.value) // is it a string or a number
        .map((el) => ({
          word: el.irish,
          meaning: el.english,
          id: el.id,
          cluster_id: el.cluster_id,
          audio: {
            Connacht: true, // Assume audio is available initially
            Munster: true,
            Ulster: true,
          },
        }))
    : [];
});
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>
