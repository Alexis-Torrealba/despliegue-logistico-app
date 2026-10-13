import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // Carpetas de skills y herramientas de agentes: no son parte de la app, y en Windows
      // instalarlas con el servidor encendido lo tumbaba con EBUSY
      ignored: ["**/.agents/**", "**/.claude/**", "**/.impeccable/**"],
    },
  },
});
