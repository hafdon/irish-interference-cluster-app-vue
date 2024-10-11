<template>
  <div class="quiz-page p-6 bg-gray-50 min-h-screen">
    <ClusterQuiz
      v-if="clusterId"
      @quizComplete="handleQuizComplete"
      :clusterId="clusterId"
    />
    <div v-else>
      <p>No cluster with this id.</p>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
import ClusterQuiz from "@/components/ClusterQuiz.vue";

import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const clusterId = ref<number | null>(null);

const assignClusterId = (id: number | string | string[] | null) => {
  if (id) {
    const parsedId = Number(id);
    // if the route id is a number, set our local ref
    if (!isNaN(parsedId)) {
      clusterId.value = parsedId;
    } else {
      console.error(`Invalid cluster id ${id}`);
      // TODO Handle invalid id as needed, e.g. redirect or show an error
    }
  } else {
    console.error("No cluster id provided in the route.");
    // TODO  Handle missing id as needed
  }
};

/**
 * Component can stay mounted while route changes.
 * Wath for route changes to update `clusterId
 */
watch(
  () => route.params.id,
  (newId) => {
    assignClusterId(newId);
  }
);

onMounted(() => {
  const idParam = route.params.id;
  assignClusterId(idParam);
});

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