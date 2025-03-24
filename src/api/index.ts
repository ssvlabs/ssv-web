import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import urlJoin from "url-join";

export const endpoint = (...paths: (string | number)[]) => {
  const ssvNetwork = getSSVNetworkDetails();
  return urlJoin(
    ssvNetwork.api,
    ssvNetwork.apiVersion,
    ssvNetwork.apiNetwork,
    ...paths.map(String),
  );
};

// Re-export the API modules
export * from "./account";
export * from "./cluster";
export * from "./ssv";
export * from "./validators";
export * from "./terms";
export * from "./faucet";
