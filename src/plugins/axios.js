// src/plugins/axios.js
import axios from "axios";

// Create an Axios instance with base URL pointing to '/api'
const apiClient = axios.create({
  baseURL: "/api", // This will be proxied to your backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get the toast instance
let toast = null;
export const setToastInstance = (instance) => {
  toast = instance;
};

/**
 * Axios interceptors allow you to intercept and modify requests or responses 
 * before they are handled by then or catch. This feature is powerful for:

Centralizing Logic: Such as adding authentication tokens, logging, or handling errors 
uniformly across all API calls.

Modifying Requests/Responses: To include additional headers, transform data, 
or handle specific status codes.

Propagating the Error: By returning Promise.reject(error);, 
you ensure that the error continues to propagate down the promise chain, 
allowing individual API calls or components to handle it further if needed.

 */

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Any status codes outside the range of 2xx cause this function to trigger

    if (error.response) {
      // The request was made and the server responded with a status code outside 2xx
      const { status, data } = error.response;
      let errorMessage = "An error occurred.";

      // Customize error messages based on status code
      switch (status) {
        case 400:
          errorMessage = data.detail || "Bad Request.";
          break;
        case 401:
          errorMessage = data.detail || "Unauthorized. Please log in.";
          break;
        case 403:
          errorMessage = data.detail || "Forbidden. You don't have access.";
          break;
        case 404:
          errorMessage = data.detail || "Resource not found.";
          break;
        case 500:
          errorMessage = data.detail || "Internal Server Error.";
          break;
        default:
          errorMessage = data.detail || `Error: ${status}`;
      }

      // Log the error to the console for debugging
      console.error(`API Error [${status}]: ${errorMessage}`);

      // Display an alert to the user
      if (toast) {
        toast.error(errorMessage);
      } else {
        // Fallback to window.alert if toast is not set
        window.alert(errorMessage);
      }

      // Optionally, you can handle specific status codes here
      // For example, redirect to login on 401 Unauthorized
      // if (status === 401) {
      //   window.location.href = '/login';
      // }

      // Reject the promise to allow further handling in specific requests if needed
      return Promise.reject(error);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from the server:", error.request);
      if (toast) {
        toast.error("No response from server. Please try again later.");
      } else {
        window.alert("No response from server. Please try again later.");
      }
      return Promise.reject(error);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error in setting up the request:", error.message);
      if (toast) {
        toast.error("An unexpected error occurred.");
      } else {
        window.alert("An unexpected error occurred.");
      }
      return Promise.reject(error);
    }
  }
);

export default apiClient;

/**
 * Usage in service layer:
 * 
 * // src/services/wordService.js
import apiClient from "@/plugins/axios";

// Fetch all words
export const fetchWords = async () => {
  try {
    const response = await apiClient.get("/words/");
    return response.data;
  } catch (error) {
    // Additional error handling if necessary
    // Errors are already handled globally, so this might be optional
    throw error; // Re-throw to allow components to handle it if needed
  }
};

// Fetch a single word by ID
export const fetchWordById = async (wordId) => {
  try {
    const response = await apiClient.get(`/words/${wordId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new word
export const createWord = async (wordData) => {
  try {
    const response = await apiClient.post("/words/", wordData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an existing word
export const updateWord = async (wordId, updatedData) => {
  try {
    const response = await apiClient.put(`/words/${wordId}/`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a word
export const deleteWord = async (wordId) => {
  try {
    await apiClient.delete(`/words/${wordId}/`);
    return;
  } catch (error) {
    throw error;
  }
};

 */

/** Usage in a component
 * 
 * <template>
  <div>
    <h1>All Words</h1>
    <ul>
      <li v-for="word in words" :key="word.id">
        {{ word.irish }} - {{ word.english }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchWords } from "@/services/wordService";

const words = ref([]);

const loadWords = async () => {
  try {
    words.value = await fetchWords();
  } catch (error) {
    // Errors are already handled globally
    // Optionally, perform additional error handling here
    console.error("Failed to load words:", error);
  }
};

onMounted(() => {
  loadWords();
});
</script>

 */
