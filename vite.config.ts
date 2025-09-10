import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "82f5b2c2-e4ae-4501-b50d-ec7a56002a3a-00-1dzmjmxvp2sfh.janeway.replit.dev",
      ".replit.dev",
      ".replit.com"
    ],
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
