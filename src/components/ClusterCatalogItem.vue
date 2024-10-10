<template>
  <div v-if="item">
    <pre>{{ words }}</pre>
  </div>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const words = computed(() =>
  props?.item?.cluster
    ? Object.getOwnPropertyNames(props.item.cluster)
        .sort((a, b) => a.localeCompare(b))
        .join(", ")
    : ""
);
</script>