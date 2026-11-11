import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        portfolio: fileURLToPath(new URL("./index.html", import.meta.url)),
        resume: fileURLToPath(new URL("./resume/index.html", import.meta.url)),
      },
    },
  },
});
