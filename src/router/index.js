// src/router/index.js
import AssignClusterForm from "@/components/AssignClusterForm.vue";
import ClusterList from "@/components/ClusterList.vue";
import WordList from "@/components/WordList.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "WordList",
    component: WordList,
  },
  {
    path: "/words/:id/reassign",
    name: "ReassignCluster",
    component: AssignClusterForm,
    props: true, // Allows route params to be passed as props
  },
  {
    path: "/cluster/",
    name: "ClusterList",
    component: ClusterList,
    props: true, // Allows route params to be passed as props
  },

  // Add other routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
