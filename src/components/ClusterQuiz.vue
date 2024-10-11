<template>
  <div class="word-quiz-container p-4 bg-gray-100 rounded-md shadow-md">
    <!-- Conditional Rendering using <template> -->
    <template v-if="currentWord">
      <div class="current-word-card mb-4">
        <!-- Display the current word in Irish -->
        <h2 class="text-xl font-bold text-gray-800 mb-2">
          {{ currentWord.irish }}
        </h2>

        <!-- Audio Buttons -->
        <div class="flex flex-wrap space-x-2 mb-4">
          <button
            v-for="region in audioRegions"
            :key="region"
            @click="playAudio(currentWord.irish, region)"
            :disabled="!currentWord.audio?.[region] || isPlaying"
            :class="audioButtonClasses[region]"
            class="text-white text-xs px-3 py-1 rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {{ region }}
          </button>
        </div>

        <!-- User Input for Meaning -->
        <div class="input-section mb-4">
          <label for="meaning" class="block text-sm font-medium text-gray-700">
            Enter the English meaning:
          </label>
          <input
            id="meaning"
            v-model="userAnswer"
            @keyup.enter="submitAnswer"
            type="text"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Type your answer here..."
          />
        </div>

        <!-- Multiple-Choice Options -->
        <div class="options-section mb-4">
          <p class="block text-sm font-medium text-gray-700 mb-2">
            Select the correct English meaning:
          </p>
          <div class="options-grid grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              v-for="option in currentOptions"
              :key="option"
              @click="selectAnswer(option)"
              :disabled="isOptionSelected"
              :class="getOptionClass(option)"
              class="w-full text-left text-sm px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none transition-colors"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <!-- <div class="submit-section mb-4">
          <button
            @click="submitAnswer"
            :disabled="isSubmitting"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
          >
            Submit
          </button>
        </div>-->

        <!-- Feedback Message -->
        <div v-if="feedback" :class="feedbackClass" class="mb-4 p-2 rounded-md">
          {{ feedback }}
        </div>
      </div>

      <!-- Quiz Progress -->
      <div class="progress-section mb-4">
        <p class="text-sm text-gray-700">
          Question {{ currentIndex + 1 }} of {{ words.length }}
        </p>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-indigo-600 h-2.5 rounded-full"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>
    </template>

    <template v-else>
      <!-- Quiz Completion -->
      <div class="completion-section text-center">
        <h3 class="text-2xl font-semibold text-green-600 mb-2">
          Quiz Completed!
        </h3>
        <p class="text-gray-700 mb-4">
          You answered {{ correctAnswers }} out of {{ words.length }} correctly.
        </p>
        <button
          @click="restartQuiz"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Restart Quiz
        </button>
      </div>
    </template>
  </div>
</template>

  
<script setup lang="ts">
import { Howl } from "howler";
import { computed, onMounted, ref } from "vue";
import { useToast } from "vue-toastification";

import { useAudio } from "@/composables/useAudio";
import { useClustersStore } from "@/stores/clusters";

import { shuffle } from "lodash-es";

type Word = {
  irish: string;
  english: any;
  id: number;
  cluster_id: any;
  audio: {
    Connacht: boolean;
    Munster: boolean;
    Ulster: boolean;
  };
};

const { isPlaying, playAudio } = useAudio();

const clustersStore = useClustersStore();

onMounted(() => {
  clustersStore.fetchClusters();
});

const currentOptions = computed(() =>
  shuffle(words.value.map((el: Word) => el.english))
);

const getOptionClass = (option: string) => "";

const isOptionSelected = computed(() => false);

const clusters = computed(() => {
  const data = clustersStore.clusters ?? [];
  console.log(data);
  return data;
});

// Cluster id for words to be quizzed
const props = defineProps<{
  clusterId: number | null;
}>();

const words = computed(() => {
  if (props.clusterId) {
    console.log("ClusterQuiz ", props.clusterId);
    const result = clustersStore.wordsInSameCluster(props.clusterId);
    console.log("ClusterQuiz words", result);
    return result;
  }
  console.log("ClusterQuiz words returning []");
  return [];
});

// Define emits if needed (e.g., to notify parent components)
const emits = defineEmits<{
  (e: "quizComplete", payload: { correct: number; total: number }): void;
}>();

// Initialize toast
const toast = useToast();

// Reactive state variables
const currentIndex = ref(0); // current word index
const userAnswer = ref(""); // user's input
const feedback = ref(""); // feedback message to user
const isSubmitting = ref(false); // answer is being processed
const correctAnswers = ref(0); // number of correct answers
const currentSound = ref<Howl | null>(null); // current Howl instance

// Define the regions available for audio
const audioRegions = ["Connacht", "Munster", "Ulster"] as const;
type Region = (typeof audioRegions)[number];

// Define button classes for different regions
const audioButtonClasses: Record<Region, string> = {
  Connacht: "bg-blue-500",
  Munster: "bg-green-500",
  Ulster: "bg-red-500",
};

// The word being displpayed
const currentWord = computed(() => shuffledWords.value[currentIndex.value]);

// Calculates progress of quiz
const progressPercentage = computed(() => {
  return (currentIndex.value / shuffledWords.value.length) * 100;
});

// Function to construct audio URL based on word and region
const getAudioURL = (word: string, region: Region): string => {
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

const selectAnswer = (option: string) => {
  if (currentWord.value.english === option) {
    feedback.value = "Correct!";
    feedbackClass.value = "text-green-600 bg-green-100";
    correctAnswers.value += 1;
  } else {
    feedback.value = `Incorrect. The correct meaning is "${currentWord.value.english}".`;
    feedbackClass.value = "text-red-600 bg-red-100";
  }

  // Proceed to next word after a short delay
  setTimeout(() => {
    feedback.value = "";
    isSubmitting.value = false;
    currentIndex.value += 1;

    // If quiz is complete, emit an event
    if (currentIndex.value >= shuffledWords.value.length) {
      emits("quizComplete", {
        correct: correctAnswers.value,
        total: shuffledWords.value.length,
      });
    }
  }, 1500);
};

// Function to submit the user's answer
const submitAnswer = () => {
  if (!currentWord.value) return;

  isSubmitting.value = true;
  const correctMeaning = currentWord.value.english?.trim().toLowerCase() || "";
  const userInput = userAnswer.value.trim().toLowerCase();

  if (userInput === correctMeaning) {
    feedback.value = "Correct!";
    feedbackClass.value = "text-green-600 bg-green-100";
    correctAnswers.value += 1;
  } else {
    feedback.value = `Incorrect. The correct meaning is "${currentWord.value.english}".`;
    feedbackClass.value = "text-red-600 bg-red-100";
  }

  // Clear user input
  userAnswer.value = "";

  // Proceed to next word after a short delay
  setTimeout(() => {
    feedback.value = "";
    isSubmitting.value = false;
    currentIndex.value += 1;

    // If quiz is complete, emit an event
    if (currentIndex.value >= shuffledWords.value.length) {
      emits("quizComplete", {
        correct: correctAnswers.value,
        total: shuffledWords.value.length,
      });
    }
  }, 1500);
};

// Function to restart the quiz
const restartQuiz = () => {
  currentIndex.value = 0;
  correctAnswers.value = 0;
  feedback.value = "";
};

// Reactive class for feedback message
const feedbackClass = ref("");

// Optionally, shuffle the words for each quiz session
// You can uncomment the following lines if you want to shuffle

const shuffledWords = ref(shuffle(words.value));

// Then, use `shuffledWords.value` instead of `props.words` throughout
</script>
  
<style scoped>
.word-quiz-container {
  max-width: 600px;
  margin: 0 auto;
}
</style>
  