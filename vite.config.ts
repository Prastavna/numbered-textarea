import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  pack: {
    entry: {
      web: "src/web/index.ts",
      react: "src/react/index.tsx",
    },
    dts: {
      tsgo: true,
    },
    exports: true,
    deps: {
      neverBundle: ["react"],
    },
  },
  test: {
    environment: "happy-dom",
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
