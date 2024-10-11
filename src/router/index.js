// src/router/index.js
import AssignClusterForm from "@/components/AssignClusterForm.vue";
import ClusterCatalog from "@/components/ClusterCatalog.vue";
import ClusterList from "@/components/ClusterList.vue";
import ClusterQuizContainer from "@/components/ClusterQuizContainer.vue";
import WordAddForm from "@/components/WordAddForm.vue";
import WordList from "@/components/WordList.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "WordList",
    component: WordList,
  },
  {
    path: "/word-add",
    name: "AddWord",
    component: WordAddForm,
  },
  {
    path: "/words/:id/reassign",
    name: "ReassignCluster",
    component: AssignClusterForm,
    props: true, // Allows route params to be passed as props
  },
  {
    path: "/cluster/:id?",
    name: "ClusterList",
    component: ClusterList,
    props: true, // Allows route params to be passed as props
  },
  {
    path: "/cluster-catalog/",
    name: "ClusterCatalog",
    component: ClusterCatalog,
    props: true, // Allows route params to be passed as props
  },
  {
    path: "/cluster-quiz/:id?",
    name: "ClusterQuiz",
    component: ClusterQuizContainer,
    props: true, // Allows route params to be passed as props
  },

  // Add other routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
