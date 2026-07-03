import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // 🔥 PAKSA ENVIRONMENT VARIABLE!
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://socialscheduler-backend.up.railway.app/api')
  }
});