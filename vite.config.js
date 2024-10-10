// vite.config.js
import vue from "@vitejs/plugin-vue";
import path from "path"; // Import the path module
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"), // Define '@' as an alias for 'src'
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL, // Uses the base URL from environment
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
