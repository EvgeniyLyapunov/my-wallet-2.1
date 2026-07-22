import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { visualizer } from "rollup-plugin-visualizer";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  plugins: [
    Components({
      dts: "./src/components.d.ts",
      types: [],
    }),
    AutoImport({
      imports: [
        "vue",
        "pinia",
        {
          vuetify: [
            "useTheme",
            "useRtl",
            "useLocale",
            "useDisplay",
            "useLayout",
          ],
        },
      ],
      dts: "src/auto-imports.d.ts",
      dirs: ["src/stores"],
    }),
    vue(),
    vuetify({ autoImport: true }),
    visualizer({
      template: "treemap",
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "analyse.html",
    }) as any,
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5108,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("vue") ||
              id.includes("pinia") ||
              id.includes("vue-router")
            ) {
              return "vue-core";
            }
            if (id.includes("vuetify")) {
              return "vuetify";
            }
            if (id.includes("apexcharts")) {
              return "apexcharts";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
