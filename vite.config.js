import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [{
    name: "static-directory-routes",
    generateBundle: {
      order: "post",
      handler(_options, bundle) {
        const index = bundle["index.html"];
        if (!index || index.type !== "asset") this.error("The portfolio index was not generated.");
        this.emitFile({ type: "asset", fileName: "2/index.html", source: index.source });
        this.emitFile({ type: "asset", fileName: ".nojekyll", source: "" });
      },
    },
  }],
  build: {
    rollupOptions: {
      input: {
        portfolio: fileURLToPath(new URL("./index.html", import.meta.url)),
        resume: fileURLToPath(new URL("./resume/index.html", import.meta.url)),
      },
    },
  },
});
