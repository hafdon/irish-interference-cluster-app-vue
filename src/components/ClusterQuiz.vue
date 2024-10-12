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

        <!-- Multiple-Choice Options -->
        <div class="options-section mb-4">
          <p class="block text-sm font-medium text-gray-700 mb-2">
            Select the correct English meaning:
          </p>
          <div class="options-grid grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              v-for="option in multipleChoiceOptions"
              :key="option"
              @click="selectAnswer(option)"
              class="w-full text-left text-sm px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none transition-colors"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <!-- Feedback Message -->
        <div v-if="feedback" :class="feedbackClass" class="mb-4 p-2 rounded-md">
          {{ feedback }}
        </div>
      </div>

      <!-- Quiz Progress Bar-->
      <ProgressBar :index="currentIndex + 1" :length="words.length">
        Question {{ currentIndex + 1 }} of {{ words.length }}
      </ProgressBar>
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
    <router-link
      :to="{ name: 'ClusterList', params: { id: clusterId } }"
      class="block text-center bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600 transition-colors duration-200"
    >
      To Cluster Audio
    </router-link>
  </div>
</template>

  
<script setup lang="ts">
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

const multipleChoiceOptions = computed(() =>
  shuffle(words.value.map((el: Word) => el.english))
);

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
const feedback = ref(""); // feedback message to user
const isSubmitting = ref(false); // answer is being processed
const correctAnswers = ref(0); // number of correct answers

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

// Function to restart the quiz
const restartQuiz = () => {
  currentIndex.value = 0;
  correctAnswers.value = 0;
  feedback.value = "";
};

// Reactive class for feedback message
const feedbackClass = ref("");

// Shuffle the words for each quiz session
const shuffledWords = ref(shuffle(words.value));
</script>
  
<style scoped>
.word-quiz-container {
  max-width: 600px;
  margin: 0 auto;
}
</style>
  