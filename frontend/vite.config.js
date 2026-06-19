import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "force-close",
      closeBundle() {
        // Force exit to prevent Vercel build timeout from hanging process
        setTimeout(() => process.exit(0), 1500);
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
    headers: {
      // Recommended for OAuth popup flows (e.g., Google Identity Services)
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
});
