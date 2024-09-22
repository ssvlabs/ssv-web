import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { useBlockNumber, useReadContract } from "wagmi";
import { TokenABI } from "@/lib/abi/token";
import { useApprove } from "@/lib/contract-interactions/erc-20/write/use-approve";
import React, { useMemo } from "react";
import { Stepper } from "@/components/ui/stepper";
import { toast } from "@/components/ui/use-toast";
import { globals } from "@/config";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { keepPreviousData } from "@tanstack/react-query";
import { isUndefined } from "lodash-es";
import { useAccount } from "@/hooks/account/use-account";

export type WithAllowanceProps = {
  size?: ButtonProps["size"];
  amount: bigint;
};

type WithAllowanceFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof WithAllowanceProps> &
    WithAllowanceProps
>;

export const WithAllowance: WithAllowanceFC = ({
  className,
  amount,
  size,
  ...props
}) => {
  const account = useAccount();
  const ssvNetworkDetails = useSSVNetworkDetails();
  const block = useBlockNumber({ watch: true });

  const allowance = useReadContract({
    abi: TokenABI,
    address: ssvNetworkDetails?.tokenAddress,
    functionName: "allowance",
    args: [account.address!, ssvNetworkDetails?.setterContractAddress],
    blockNumber: block.data,
    query: {
      placeholderData: keepPreviousData,
      enabled: Boolean(account.address && block.data),
    },
  });

  const approver = useApprove();
  const approve = () => {
    if (!ssvNetworkDetails)
      return toast({
        variant: "destructive",
        title: "SSV Network Details not found",
      });

    approver.write(
      {
        spender: ssvNetworkDetails!.setterContractAddress,
        amount: globals.MAX_WEI_AMOUNT,
      },
      withTransactionModal(),
    );
  };

  const hasAllowance = allowance.isSuccess ? allowance.data >= amount : true;
  const canProceed =
    allowance.isSuccess && hasAllowance && approver.wait.isSuccess;

  const childrenWithProps = useMemo(
    () =>
      React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            // @ts-expect-error - disabled prop
            disabled: !canProceed,
            size,
          });
        }
        return child;
      }),
    [canProceed, props.children, size],
  );

  if (allowance.isLoading || isUndefined(allowance.data)) return props.children;
  if (allowance.isSuccess && hasAllowance && approver.wait.status === "idle")
    return props.children;

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className={cn("flex gap-4 [&>*]:flex-1")}>
        <Button
          size={size}
          onClick={approve}
          isLoading={approver.isPending}
          disabled={canProceed}
          isActionBtn
          loadingText="Approving..."
        >
          Approve SSV
        </Button>
        {childrenWithProps}
      </div>
      <Stepper
        className="w-[56%] mx-auto"
        steps={[
          {
            variant: !canProceed ? "active" : "done",
          },
          {
            variant: canProceed ? "active" : "default",
          },
        ]}
      />
    </div>
  );
};

WithAllowance.displayName = "WithAllowance";
