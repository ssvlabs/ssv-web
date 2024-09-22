import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  if (!env.VITE_SSV_NETWORKS) {
    console.error("VITE_SSV_NETWORKS is not defined in .env");
  }
  return {
    worker: {
      format: "es",
    },
    build: {
      target: "es2022",
      outDir: "build",
      sourcemap: mode === "development",
      rollupOptions: {
        output: {
          sourcemapExcludeSources: true, // Ignore sources in node_modules
        },
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    plugins: [
      react({
        babel: {
          plugins: [["module:@preact/signals-react-transform"]],
        },
      }),
      nodePolyfills({
        globals: {
          Buffer: mode === "production",
        },
      }),
      svgr(),
    ],
    define: {
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
      NETWORKS: JSON.parse(env.VITE_SSV_NETWORKS),
      "import.meta.env.VITE_SSV_NETWORKS": JSON.parse(env.VITE_SSV_NETWORKS),
      ...(mode === "development" ? { global: {} } : undefined),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
