import apiClient from "@/plugins/axios";

export const fetchWords = () => apiClient.get("/words/");

// export const fetchWordById = async (wordId) => {
//   const response = await axios.get(`/words/${wordId}/`);
//   return response.data;
// };

export const createWord = (wordData) => apiClient.post("/words/", wordData);

// export const updateWord = async (wordId, updatedData) => {
//   const response = await axios.put(`/words/${wordId}/`, updatedData);
//   return response.data;
// };

// export const deleteWord = async (wordId) => {
//   await axios.delete(`/words/${wordId}/`);
//   return;
// };
