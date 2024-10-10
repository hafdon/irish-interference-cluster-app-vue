<template>
  <div
    class="flex items-center px-2 py-1 border-b border-gray-200 text-sm hover:bg-gray-100 space-x-2"
  >
    <!-- Irish Word -->
    <span class="flex-1 truncate">{{ word.irish }}</span>

    <!-- English Translation -->
    <span class="text-gray-500 truncate w-24 md:w-32 lg:w-40">
      {{ word.english }}
    </span>

    <!-- Toggle Cluster Visibility Button -->
    <span>
      <button
        class="text-blue-500 hover:underline text-xs px-1 py-0.5"
        @click="emitToggleClusterVisibilityClick"
      >
        {{
          clustersFiltered === false
            ? "Show Only This Cluster"
            : "Show All Clusters"
        }}
      </button>
    </span>

    <!-- Reassign Link -->
    <span>
      <router-link
        :to="{ name: 'ReassignCluster', params: { id: word.id } }"
        class="text-green-500 hover:underline text-xs px-1 py-0.5"
      >
        Reassign
      </router-link>
    </span>

    <!-- Cluster View Link -->
    <span>
      <router-link
        :to="{ name: 'ClusterList', params: { id: word.cluster_id } }"
        class="text-blue-500 hover:underline text-xs px-1 py-0.5"
      >
        Cluster View
      </router-link>
    </span>

    <!-- Remove Button -->
    <span>
      <button
        class="text-red-500 hover:underline text-xs px-1 py-0.5"
        @click="emitRemoveWord()"
      >
        Remove
      </button>
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  word: {
    type: Object,
    required: false,
  },
  clustersFiltered: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits(["toggleClusterVisibilityClicked"]);

const emitToggleClusterVisibilityClick = () => {
  emits("toggleClusterVisibilityClicked", props.word);
};

const emitRemoveWord = () => {
  emits("removeWord", props.word.id);
};
</script>
