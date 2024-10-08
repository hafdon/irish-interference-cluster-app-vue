// src/composables/useLogger.mjs
export function useLogger(id, existingOpts) {
  console.log("Cluster ID:", id);
  console.log("Existing Options:", existingOpts);
}

export function useErrorLogger(error, context) {
  console.error(`Error in ${context}:`, error);
}
