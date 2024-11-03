import "@/lib/analytics/sentry";

import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

import ReactDOM from "react-dom/client";

import { router } from "@/app/routes/router";

import { RainbowKitProvider } from "@/lib/providers/rainbow-kit";
import { persister, queryClient } from "@/lib/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { WagmiProvider } from "wagmi";
import { config } from "./wagmi/config";

import { RouterProvider } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import "@/global.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import { GTMFrame } from "@/lib/analytics/gtm";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={config}>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <RainbowKitProvider>
        <RouterProvider router={router} />
        <GTMFrame />
        <Toaster />
      </RainbowKitProvider>
    </PersistQueryClientProvider>
  </WagmiProvider>,
);
