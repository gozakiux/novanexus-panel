import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Rutas relativas: funciona igual en localhost y en GitHub Pages (subcarpeta /novanexus-panel/).
  base: "./",
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});
