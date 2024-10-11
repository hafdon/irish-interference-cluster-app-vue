<template>
  <div class="progress-section mb-4">
    <p class="text-sm text-gray-700"><slot></slot></p>
    <div class="w-full bg-gray-200 rounded-full h-2.5">
      <div
        class="bg-indigo-600 h-2.5 rounded-full"
        :style="{ width: progressPercentage + '%' }"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    index: {
        type: Number,
        required: true
    },
    length:  {
        type: Number,
        required: true
    },

})

// Calculates progress of quiz
const progressPercentage = computed(() => {
  return props.index / props.length * 100
});

</script>