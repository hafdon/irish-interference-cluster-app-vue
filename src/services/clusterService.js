// src/services/apiService.js
import apiClient from "@/plugins/axios";

export const fetchClusters = () => apiClient.get("/clusters/");

// export const fetchClusterById = async (clusterId) => {
//   const response = await axios.get(`/clusters/${clusterId}/`);
//   return response.data;
// };

export const createCluster = (clusterData) =>
  apiClient.post("/clusters/", clusterData);

// export const updateCluster = async (clusterId, updatedData) => {
//   const response = await axios.put(`/clusters/${clusterId}/`, updatedData);
//   return response.data;
// };

// export const deleteCluster = async (clusterId) => {
//   await axios.delete(`/clusters/${clusterId}/`);
//   return;
// };

// export const assignWordToCluster = async (wordId, clusterId) => {
//   const response = await axios.post(`/clusters/${clusterId}/assign-word/`, {
//     wordId,
//   });
//   return response.data;
// };
