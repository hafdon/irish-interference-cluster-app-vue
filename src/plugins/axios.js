// src/plugins/axios.js
import axios from "axios";

// Create an Axios instance with base URL pointing to '/api'
const apiClient = axios.create({
  baseURL: "/api", // This will be proxied to your backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

/**
 * Example of fetching all words:

 * // src/components/WordsList.vue

<template>
 <div>
   <h1>Irish Words</h1>
   <ul>
     <li v-for="word in words" :key="word.id">
       {{ word.irish }} - {{ word.english }}
     </li>
   </ul>
 </div>
</template>

<script>
import apiClient from '@/plugins/axios';

export default {
 data() {
   return {
     words: [],
   };
 },
 created() {
   this.fetchWords();
 },
 methods: {
   async fetchWords() {
     try {
       const response = await apiClient.get('/words/');
       this.words = response.data;
     } catch (error) {
       console.error('Error fetching words:', error);
     }
   },
 },
};
</script>
 */
