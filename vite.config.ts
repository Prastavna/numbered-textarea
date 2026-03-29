import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite-plus";

const isCustomElement = (tag: string) => tag === "numbered-textarea";

export default defineConfig({
  base: "./",
  staged: {
    "*": "vp check --fix",
  },
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        react: "examples/react.html",
        vue: "examples/vue.html",
        webComponent: "examples/web-component.html",
      },
    },
  },
  pack: {
    entry: {
      web: "src/web/index.ts",
      react: "src/react/index.tsx",
      vue: "src/vue/index.ts",
    },
    dts: true,
    exports: true,
    deps: {
      neverBundle: ["react", "vue"],
    },
  },
  test: {
    environment: "happy-dom",
    server: {
      deps: {
        inline: ["vue"],
      },
    },
  },
  plugins: [
    vue({
      template: { compilerOptions: { isCustomElement } },
    }),
  ],
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
