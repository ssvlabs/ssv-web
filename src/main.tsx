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

import { Text } from "@/components/ui/text";
import { Toaster } from "@/components/ui/toaster";
import "@/global.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";

// if (import.meta.env.DEV) {
//   // @ts-expect-error BigInt is not supported in JSON
//   BigInt.prototype["toJSON"] = function () {
//     return this.toString();
//   };
// }
console.log(import.meta.env.DEV);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={config}>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <RainbowKitProvider>
        {/* {import.meta.env.DEV && (
          <ReactQueryDevtools
            buttonPosition="bottom-right"
            client={queryClient}
          />
        )} */}
        <RouterProvider router={router} />
        <Toaster />
        <Text
          variant="caption-medium"
          className="fixed bottom-0 left-0 m-2 text-gray-500 pointer-events-none"
        >
          {APP_VERSION}
        </Text>
      </RainbowKitProvider>
    </PersistQueryClientProvider>
  </WagmiProvider>,
);
