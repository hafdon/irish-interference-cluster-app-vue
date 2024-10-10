<template>
  <div class="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
    <p class="text-xl font-medium mb-3">
      {{ item.word }} -
      <span class="text-gray-600 italic">{{ item.meaning }}</span>
    </p>
    <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
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
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import { Howl, HowlOptions } from "howler"; // Import types from howler
import { useToast } from "vue-toastification";

// Define the structure of the audio object
interface AudioSources {
  Connacht?: string;
  Munster?: string;
  Ulster?: string;
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

// Initialize toast
const toast = useToast();

// Reactive state
const isPlaying: Ref<boolean> = ref(false);
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

  // Define Howl options with type annotations
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
    },
  };

  // Initialize and play the sound
  currentSound = new Howl(howlOptions);
  currentSound.play();
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
