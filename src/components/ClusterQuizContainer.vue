<template>
  <div class="quiz-page p-6 bg-gray-50 min-h-screen">
    <ClusterQuiz :words="wordList" @quizComplete="handleQuizComplete" />
  </div>
</template>
  
  <script setup lang="ts">
import ClusterQuiz from "@/components/ClusterQuiz.vue";
import type { Word } from "@/types/Word";
import { ref } from "vue";

// Example word list
const wordList = ref<Word[]>([
  {
    id: 1,
    irish: "Dia",
    english: "God",
    cluster_id: 1,
    audio: {
      Connacht: "connacht-url",
      Munster: "munster-url",
      Ulster: "ulster-url",
    },
  },
  {
    id: 2,
    irish: "Gaeilge",
    english: "Irish Language",
    cluster_id: 1,
    audio: {
      Connacht: "connacht-url",
      Munster: "munster-url",
      Ulster: "ulster-url",
    },
  },
  // Add more Word objects as needed
]);

// Handle quiz completion
const handleQuizComplete = (payload: { correct: number; total: number }) => {
  alert(
    `Quiz Completed! You answered ${payload.correct} out of ${payload.total} correctly.`
  );
};
</script>
  
  <style scoped>
.quiz-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>