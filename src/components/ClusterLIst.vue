<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
      <h1 class="text-3xl font-bold mb-6 text-center text-indigo-600">
        Irish Word Audio Player
      </h1>

      <form @submit.prevent="searchWord" class="mb-8">
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
        >
          <template #list-header>
            <div class="px-4 py-2 text-indigo-500 font-semibold">
              Suggestions
            </div>
          </template>
          <template #list-item-text="slot">
            <span v-html="highlightMatch(slot.item)"></span>
          </template>
          <template #list-footer>
            <div class="px-4 py-2 text-gray-500">End of Suggestions</div>
          </template>
        </vue3-simple-typeahead>
        <button
          type="submit"
          class="mt-4 w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors"
        >
          Search
        </button>
      </form>

      <div v-if="wordsInSameCluster.length">
        <h2 class="text-2xl font-semibold mb-6 text-center">
          Audio Options for Cluster Containing "{{ inputWord }}"
        </h2>

        <div>
          <ClusterListItem
            v-for="item in wordsInSameCluster"
            :key="item.word"
            :item="item"
          />
        </div>
      </div>

      <div v-else-if="searched">
        <p class="text-center text-red-500 text-lg">
          No results found for "{{ inputWord }}"
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import apiClient from "@/plugins/axios"; // Import your Axios instance
import { Howl } from "howler";
import { useToast } from "vue-toastification"; // Import useToast
import ClusterListItem from "@/components/ClusterListItem.vue";

// Initialize toast
const toast = useToast();

// State variables
const inputWord = ref("");
const words = ref([]);
const searched = ref(false);
const isPlaying = ref(false);
let currentSound = null;
const apiDataAllWords = ref([]);

// Fetch all words on initial load for autocomplete
const fetchAllWords = async () => {
  try {
    const response = await apiClient.get(`/words/`); // Now run locally!
    apiDataAllWords.value = response.data;
    /**
     * [
    {
        "irish": "aodh",
        "english": "inflammation",
        "cluster_id": null,
        "id": 3
    }
]
     */
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
};

// Set the v-model of the typeahead
// (This causes automatic searching)
const handleSelect = (selectedItem) => {
  inputWord.value = selectedItem;
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

const wordsInSameCluster = computed(() => {
  console.log("wordsInSameCluster");

  const word = inputWord.value.trim().toLowerCase();
  console.log("word", word);
  let clusterId = null;

  if (!word) return [];

  const matchingWordObject = apiDataAllWords.value.filter(
    (wordObj) => wordObj.irish === word
  );

  console.log("matchingWordObject", matchingWordObject);

  if (matchingWordObject.length) {
    console.log("setting clusterId", clusterId);

    clusterId = matchingWordObject[0].cluster_id;
  }

  console.log("clusterId", clusterId);

  if (clusterId) {
    return apiDataAllWords.value
      .filter((wordObj) => wordObj.cluster_id === clusterId)
      .map((el) => ({
        word: el.irish,
        meaning: el.english,
        audio: {
          Connacht: true, // Assume audio is available initially
          Munster: true,
          Ulster: true,
        },
      }));
  }
  return [];
});

// Function to construct audio URL based on word and region
const getAudioURL = (word, region) => {
  const formattedWord = word.trim().toLowerCase();
  switch (region) {
    case "Connacht":
      return `https://www.teanglann.ie/CanC/${formattedWord}.mp3`;
    case "Munster":
      return `https://www.teanglann.ie/CanM/${formattedWord}.mp3`;
    case "Ulster":
      return `https://www.teanglann.ie/CanU/${formattedWord}.mp3`;
    default:
      return "";
  }
};

// Function to play audio based on word and region
const playAudio = (item, region) => {
  const word = item.word.trim().toLowerCase();
  const url = getAudioURL(word, region);

  // Stop previous sound if playing
  if (currentSound) {
    currentSound.stop();
  }

  // Play new sound
  currentSound = new Howl({
    src: [url],
    html5: true, // Enable to stream large files
    onplay: () => {
      isPlaying.value = true;
    },
    onend: () => {
      isPlaying.value = false;
    },
    onloaderror: (id, error) => {
      console.error("Load error:", error);
      isPlaying.value = false;
      // Use toast to inform the user about the error
      toast.error(
        `Failed to load audio for "${item.word}" in region "${region}". The button will be disabled.`
      );
      // Disable the button as audio failed to load
      item.audio[region] = false;
    },
    onplayerror: (id, error) => {
      console.error("Play error:", error);
      isPlaying.value = false;
      // Use toast to inform the user about the error
      toast.error(
        `Failed to play audio for "${item.word}" in region "${region}". The button will be disabled.`
      );
      // Disable the button as audio failed to play
      item.audio[region] = false;
    },
  });

  currentSound.play();
};
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>
