// src/services/apiService.js
import apiClient from "@/plugins/axios";

/**
 *
 * fetchWords
 * createWord
 * updateWord
 * deleteWord
 * 
 * Align function names with the underlying HTTP methods to provide clarity about the operation being performed.

| Backend   | Service | Store   | Store exports as
| GET       |  fetch  | get     | fetch
| POST      |  create | add     | add
| PUT/PATCH |  update | modify  |
| DELETE    | delete  | remove  |
 */

// deprecated file
export const fetchWords = () => apiClient.get("/words/");
export const fetchClusters = () => apiClient.get("/clusters/");

export const createWord = (wordData) => apiClient.post("/words/", wordData);
export const createCluster = (clusterData) =>
  apiClient.post("/clusters/", clusterData);
