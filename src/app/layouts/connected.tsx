import { useAccount } from "@/hooks/account/use-account";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import type { FC } from "react";

import React from "react";
import { erc20Abi, parseEventLogs } from "viem";
import { usePublicClient } from "wagmi";

export const WatchTransferEvents: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const account = useAccount();
  const client = usePublicClient();
  const ssvNetwork = useSSVNetworkDetails();
  client?.watchContractEvent({
    abi: erc20Abi,
    address: ssvNetwork.tokenAddress,
    eventName: "Transfer",
    onLogs: (logs) => {
      console.log("logs:", logs);
      const events = parseEventLogs({
        abi: erc20Abi,
        logs,
      });
      console.log("event:", events);
    },
  });

  console.log("watching transfer events", account.address);
  return <>{children}</>;
};
