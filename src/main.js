import { createApp } from "vue";
import SimpleTypeahead from "vue3-simple-typeahead";
import "vue3-simple-typeahead/dist/vue3-simple-typeahead.css"; //Optional default CSS
import App from "./App.vue";
import "./index.css"; // Import Tailwind CSS

// Import Vue Toastification and its CSS
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

// Create Vue app
const app = createApp(App);

// Use Vue3SimpleTypeahead
app.use(SimpleTypeahead);

// Use Vue Toastification with default options or customize as needed
app.use(Toast, {
  // You can set your default options here
  position: POSITION.BOTTOM_LEFT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
});

// Mount the app
app.mount("#app");
