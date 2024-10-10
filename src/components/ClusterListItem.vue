<template>
  <div
    class="flex flex-col p-2 border border-gray-200 rounded-md shadow-sm bg-white"
  >
    <!-- Word and Meaning -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-800">
          {{ item.word }} -
          <span class="text-gray-500 italic text-xs">{{ item.meaning }}</span>
        </p>
      </div>
      <div class="flex space-x-2">
        <!-- Reassign Cluster Link -->
        <router-link
          :to="{ name: 'ReassignCluster', params: { id: item.id } }"
          class="text-indigo-500 text-xs hover:underline"
        >
          Reassign
        </router-link>

        <!-- Remove Button -->
        <button
          class="text-red-500 text-xs hover:underline"
          @click="emitRemoveWord()"
        >
          Remove
        </button>
      </div>
    </div>

    <!-- Audio Buttons -->
    <div class="flex flex-wrap mt-2 space-x-1">
      <button
        @click="playAudio(item, 'Connacht')"
        :disabled="!item.audio.Connacht || isPlaying"
        class="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
      >
        Connacht
      </button>
      <button
        @click="playAudio(item, 'Munster')"
        :disabled="!item.audio.Munster || isPlaying"
        class="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600 disabled:bg-green-300 transition-colors"
      >
        Munster
      </button>
      <button
        @click="playAudio(item, 'Ulster')"
        :disabled="!item.audio.Ulster || isPlaying"
        class="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 disabled:bg-red-300 transition-colors"
      >
        Ulster
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Howl, HowlOptions } from "howler"; // Import types from howler
import { useToast } from "vue-toastification"; // Import the useToast composable

// Define the structure of the audio object
interface AudioSources {
  Connacht: boolean;
  Munster: boolean;
  Ulster: boolean;
}

// Define the structure of the item prop
interface Item {
  word: string;
  meaning: string;
  audio: AudioSources;
}

// Define the props
const props = defineProps<{
  item: Item;
}>();

const emits = defineEmits(["audioFailure", "removeWord"]);

const emitAudioFailure = (region: keyof AudioSources) => {
  emits("audioFailure", region);
};

const emitRemoveWord = () => {
  emits("removeWord", props.item);
};

// Initialize the toast
const toast = useToast();

const isPlaying = ref(false);
let currentSound: Howl | null = null;

// Function to construct audio URL based on word and region
const getAudioURL = (word: string, region: string): string => {
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
const playAudio = (item: Item, region: keyof AudioSources) => {
  const word = item.word.trim().toLowerCase();
  const url = getAudioURL(word, region);

  // Stop previous sound if playing
  if (currentSound) {
    currentSound.stop();
  }

  // Play new sound
  const howlOptions: HowlOptions = {
    src: [url],
    html5: true, // Enable to stream large files
    onplay: () => {
      isPlaying.value = true;
    },
    onend: () => {
      isPlaying.value = false;
    },
    onloaderror: (id: number, error: any) => {
      console.error("Load error:", error);
      isPlaying.value = false;
      // Use toast to inform the user about the error
      toast.error(
        `Failed to load audio for "${item.word}" in region "${region}". The button will be disabled.`
      );
      // Disable the button as audio failed to load
      item.audio[region] = false;
      emitAudioFailure(region);
    },
    onplayerror: (id: number, error: any) => {
      console.error("Play error:", error);
      isPlaying.value = false;
      // Use toast to inform the user about the error
      toast.error(
        `Failed to play audio for "${item.word}" in region "${region}". The button will be disabled.`
      );
      // Disable the button as audio failed to play
      item.audio[region] = false;
      emitAudioFailure(region);
    },
  };

  currentSound = new Howl(howlOptions);
  currentSound.play();
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
