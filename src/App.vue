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

      <div v-if="words.length">
        <h2 class="text-2xl font-semibold mb-6 text-center">
          Audio Options for Cluster Containing "{{ inputWord }}"
        </h2>
        <div
          v-for="item in words"
          :key="item.word"
          class="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50"
        >
          <p class="text-xl font-medium mb-3">
            {{ capitalize(item.word) }} -
            <span class="text-gray-600 italic">{{ item.meaning }}</span>
          </p>
          <div
            class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0"
          >
            <button
              @click="playAudio(item, 'Connacht')"
              :disabled="!item.audio.Connacht || isPlaying"
              class="flex-1 bg-blue-500 text-white py-2 px-4 rounded disabled:bg-blue-300 hover:bg-blue-600 transition-colors"
            >
              Connacht
            </button>
            <button
              @click="playAudio(item, 'Munster')"
              :disabled="!item.audio.Munster || isPlaying"
              class="flex-1 bg-green-500 text-white py-2 px-4 rounded disabled:bg-green-300 hover:bg-green-600 transition-colors"
            >
              Munster
            </button>
            <button
              @click="playAudio(item, 'Ulster')"
              :disabled="!item.audio.Ulster || isPlaying"
              class="flex-1 bg-red-500 text-white py-2 px-4 rounded disabled:bg-red-300 hover:bg-red-600 transition-colors"
            >
              Ulster
            </button>
          </div>
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
import { ref, onMounted } from "vue";
import axios from "axios";
import { Howl } from "howler";
// import Vue3SimpleTypeahead from "vue3-simple-typeahead";
import { useToast } from "vue-toastification"; // Import useToast

// Initialize toast
const toast = useToast();

// State variables
const inputWord = ref("");
const words = ref([]);
const searched = ref(false);
const isPlaying = ref(false);
let currentSound = null;
const allWords = ref([]); // For autocomplete suggestions

// Fetch all words on initial load for autocomplete
const fetchAllWords = async () => {
  try {
    const response = await axios.get("http://localhost:3000/interferesIds");
    const data = response.data;

    const wordSet = new Set();

    data.forEach((item) => {
      const cluster = item.cluster;
      Object.keys(cluster).forEach((w) => {
        wordSet.add(w);
      });
    });

    allWords.value = Array.from(wordSet).sort();
  } catch (error) {
    console.error("Error fetching all words for autocomplete:", error);
  }
};

// Initialize allWords on component mount
onMounted(() => {
  fetchAllWords();
});

// Autocomplete Handlers
const handleInput = (event) => {
  // You can handle input events if needed
};

const handleSelect = (selectedItem) => {
  inputWord.value = selectedItem;
  // Optionally, you can trigger search automatically
  // searchWord();
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

// Function to capitalize words for display
const capitalize = (word) => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
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

// Function to search for the word and retrieve all words in relevant cluster(s)
const searchWord = async () => {
  const word = inputWord.value.trim().toLowerCase();
  if (!word) return;

  try {
    const response = await axios.get("http://localhost:3000/interferesIds");
    const data = response.data;

    // Reset previous results
    words.value = [];
    searched.value = true;

    // Use a Set to avoid duplicate words if the word appears in multiple clusters
    const wordSet = new Set();
    const wordList = [];

    // Iterate through all clusters to find where the word exists
    data.forEach((item) => {
      const cluster = item.cluster;
      if (cluster.hasOwnProperty(word)) {
        // Add all words from this cluster to the set
        Object.entries(cluster).forEach(([w, meaning]) => {
          if (!wordSet.has(w)) {
            wordSet.add(w);
            wordList.push({
              word: w,
              meaning: meaning,
              audio: {
                Connacht: true, // Assume audio is available initially
                Munster: true,
                Ulster: true,
              },
            });
          }
        });
      }
    });

    words.value = wordList;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

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
        `Failed to load audio for "${capitalize(
          item.word
        )}" in region "${region}". The button will be disabled.`
      );
      // Disable the button as audio failed to load
      item.audio[region] = false;
    },
    onplayerror: (id, error) => {
      console.error("Play error:", error);
      isPlaying.value = false;
      // Use toast to inform the user about the error
      toast.error(
        `Failed to play audio for "${capitalize(
          item.word
        )}" in region "${region}". The button will be disabled.`
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
