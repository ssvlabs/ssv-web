import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { useBlockNumber, useReadContract } from "wagmi";
import { TokenABI } from "@/lib/abi/token";
import { useApprove } from "@/lib/contract-interactions/hooks/erc20";
import React, { useMemo } from "react";
import { Stepper } from "@/components/ui/stepper";
import { toast } from "@/components/ui/use-toast";
import { globals } from "@/config";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { keepPreviousData } from "@tanstack/react-query";
import { isUndefined } from "lodash-es";
import { useAccount } from "@/hooks/account/use-account";
import type { Address } from "abitype";

export type WithAllowanceProps = {
  size?: ButtonProps["size"];
  options?: {
    token: {
      address: Address;
      symbol: string;
    };
    spender: Address;
  };
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
  options,
  ...props
}) => {
  const account = useAccount();
  const ssvNetworkDetails = useSSVNetworkDetails();
  const block = useBlockNumber({ watch: true });
  const tokenAddress =
    options?.token.address ?? ssvNetworkDetails?.tokenAddress;
  const spenderAddress =
    options?.spender ?? ssvNetworkDetails?.setterContractAddress;
  const approveContractAddress = (tokenAddress ??
    "0x0000000000000000000000000000000000000000") as Address;

  const allowance = useReadContract({
    abi: TokenABI,
    address: tokenAddress,
    functionName: "allowance",
    args: [account.address!, spenderAddress],
    blockNumber: block.data,
    query: {
      placeholderData: keepPreviousData,
      enabled: Boolean(account.address && block.data),
    },
  });

  const approver = useApprove({ contract: approveContractAddress });
  const approve = () => {
    if (!ssvNetworkDetails || !tokenAddress || !spenderAddress)
      return toast({
        variant: "destructive",
        title: "Contract details not found",
      });

    approver.write({
      args: {
        spender: spenderAddress,
        amount: globals.MAX_WEI_AMOUNT,
      },
      options: withTransactionModal(),
    });
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

  const children = useMemo(
    () =>
      React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            // @ts-expect-error - disabled prop
            isLoading: allowance.isLoading,
            size,
          });
        }
        return child;
      }),
    [allowance.isLoading, props.children, size],
  );

  if (allowance.isLoading || isUndefined(allowance.data)) return children;

  if (allowance.isSuccess && hasAllowance && approver.wait.status === "idle")
    return props.children;

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className={cn("flex gap-3 [&>*]:flex-1")}>
        <Button
          size={size}
          onClick={approve}
          isLoading={approver.isPending}
          disabled={canProceed}
          isActionBtn
          loadingText="Approving..."
        >
          Approve {options?.token.symbol ?? "SSV"}
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
