import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  if (!env.VITE_SSV_NETWORKS) {
    throw new Error("VITE_SSV_NETWORKS is not defined in .env");
  }
  return {
    build: {
      outDir: "build",
      sourcemap: true,
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
    ],
    define: {
      NETWORKS: JSON.parse(env.VITE_SSV_NETWORKS),
      "import.meta.env.VITE_SSV_NETWORKS": JSON.parse(env.VITE_SSV_NETWORKS),
      ...(mode === "development" ? { global: {} } : undefined),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
