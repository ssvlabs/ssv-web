import "@/lib/analytics/sentry";

import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

import ReactDOM from "react-dom/client";

import { router } from "@/app/routes/router";
import { NuqsAdapter } from "nuqs/adapters/react-router/v6";

import { RainbowKitProvider } from "@/lib/providers/rainbow-kit";
import { persister, queryClient } from "@/lib/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { WagmiProvider } from "wagmi";
import { config } from "./wagmi/config";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { RouterProvider } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import "@/global.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import { GTMFrame } from "@/lib/analytics/gtm";

console.log("merge testing");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={config}>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      <RainbowKitProvider>
        <NuqsAdapter>
          <RouterProvider router={router} />
        </NuqsAdapter>
        <GTMFrame />
        <Toaster />
      </RainbowKitProvider>
    </PersistQueryClientProvider>
  </WagmiProvider>,
);
