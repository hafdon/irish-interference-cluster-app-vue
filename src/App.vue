<template>
  <div id="app">
    <TheSidebar />
    <div class="main-content">
      <router-view />
      <!-- This renders the matched component -->
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useToast } from "vue-toastification";
import { setToastInstance } from "@/plugins/axios";
import TheSidebar from "@/components/TheSidebar.vue";

const toast = useToast();

onMounted(() => {
  setToastInstance(toast);
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  display: flex;
}

.main-content {
  margin-left: 200px; /* Width of the sidebar */
  padding: 20px;
  width: 100%;
}
</style>
