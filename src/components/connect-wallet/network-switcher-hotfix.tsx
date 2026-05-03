"use client";

import { useState, type ComponentPropsWithRef, type FC } from "react";
import { Check } from "lucide-react";
import { FaChevronDown, FaEthereum } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Text, textVariants } from "@/components/ui/text";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@/lib/utils/tw";

import { GoAlertFill } from "react-icons/go";
import { useChainId, useSwitchChain } from "wagmi";
import { useAccount } from "@/hooks/account/use-account";
import { networks } from "@/config/networks";

type Props = ComponentPropsWithRef<"button">;

export const NetworkSwitcher: FC<Props> = ({ className, ...props }) => {
  const [open, setOpen] = useState(false);
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChain } = useSwitchChain();

  const currentNetworkId = isConnected ? chainId : networks[0]?.networkId;

  const getNetworkLabel = (networkId: number) => {
    if (networkId === 1) return "Ethereum";
    if (networkId === 560048) return "Hoodi";
    return String(networkId);
  };

  const handleSelect = (networkId: number) => {
    if (networkId === currentNetworkId) return;
    switchChain({ chainId: networkId });
    setOpen(false);
  };

  const currentLabel = getNetworkLabel(currentNetworkId);

  return (
    <ConnectButton.Custom>
      {({ chain, openChainModal }) => {
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                {...props}
                type="button"
                data-cy="network-button"
                size="network"
                variant="secondary"
                colorScheme="wallet"
                className={textVariants({
                  variant: "body-3-medium",
                  className: cn(
                    "flex items-center gap-3 h-12 pl-4 pr-3 rounded-xl",
                    className,
                    {
                      "bg-destructive hover:bg-destructive active:bg-destructive text-[#ffffff] dark:bg-destructive dark:hover:bg-destructive dark:active:bg-destructive dark:text-[#ffffff]":
                        chain?.unsupported,
                    },
                  ),
                })}
                onClick={
                  chain?.unsupported
                    ? (ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        openChainModal();
                      }
                    : undefined
                }
              >
                {chain?.unsupported ? (
                  <>
                    <div className="flex items-center gap-3">
                      <GoAlertFill className="size-4" />
                      <Text variant="body-3-medium" className="text-[#ffffff]">
                        Wrong Network
                      </Text>
                    </div>
                    <div className="flex size-5 items-center justify-center">
                      <FaChevronDown className="size-[10px]" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <FaEthereum className="size-4" />
                      <Text variant="body-3-medium">{currentLabel}</Text>
                    </div>
                    <div className="flex size-5 items-center justify-center">
                      <FaChevronDown className="size-[10px]" />
                    </div>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 max-w-[240px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-300">
              <Command
                tabIndex={1}
                className="outline-none border-none bg-gray-50"
              >
                <CommandList id="network-switcher-command">
                  <CommandEmpty>No results found</CommandEmpty>
                  {networks.map((network) => {
                    const isActive = network.networkId === currentNetworkId;
                    const label = getNetworkLabel(network.networkId);
                    return (
                      <CommandItem
                        key={network.networkId}
                        onSelect={() => handleSelect(network.networkId)}
                        className="flex items-center gap-2 p-3 py-2.5 border-none"
                        value={String(network.networkId)}
                      >
                        <FaEthereum />
                        <Text
                          variant="body-3-medium"
                          className={cn("capitalize", {
                            "font-semibold": isActive,
                          })}
                        >
                          {label}
                        </Text>
                        <div className="ml-auto mr-2">
                          {isActive && <Check className="size-3" />}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }}
    </ConnectButton.Custom>
  );
};

NetworkSwitcher.displayName = "NetworkSwitcher";
