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
import { LuExternalLink } from "react-icons/lu";
import { GoAlertFill } from "react-icons/go";
import {
  HOODI_HOST,
  isHoodiEnvironment,
  isMainnetEnvironment,
  MAINNET_HOST,
} from "@/lib/utils/env-checker";

type Props = ComponentPropsWithRef<"button">;

export const NetworkSwitcher: FC<Props> = ({ className, ...props }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    if (isHoodiEnvironment && value === "mainnet")
      window.location.host = MAINNET_HOST;

    if (isMainnetEnvironment && value === "hoodi")
      window.location.host = HOODI_HOST;

    setOpen(false);
  };

  return (
    <ConnectButton.Custom>
      {({ chain, openChainModal }) => {
        console.log("chain:", chain);
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
                      <Text variant="body-3-medium">
                        {isMainnetEnvironment ? "Mainnet" : "Hoodi"}
                      </Text>
                    </div>
                    <div className="flex size-5 items-center justify-center">
                      <FaChevronDown className="size-[10px]" />
                    </div>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0  max-w-[240px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-300">
              <Command
                tabIndex={1}
                className="outline-none border-none bg-gray-50 "
              >
                <CommandList id="network-switcher-command">
                  <CommandEmpty>No results found</CommandEmpty>
                  <CommandItem
                    onSelect={() => handleSelect("mainnet")}
                    className="flex items-center gap-2 p-3 py-2.5 border-none"
                    value="mainnet"
                  >
                    <FaEthereum />
                    <Text
                      variant="body-3-medium"
                      className={cn("capitalize", {
                        "font-semibold": isMainnetEnvironment,
                      })}
                    >
                      Mainnet
                    </Text>
                    <div className="ml-auto mr-2 ">
                      {isMainnetEnvironment ? (
                        <Check className="size-3" />
                      ) : (
                        <LuExternalLink className="size-3" />
                      )}
                    </div>
                  </CommandItem>
                  <CommandItem
                    onSelect={() => handleSelect("hoodi")}
                    className="flex items-center gap-2 p-3 py-2.5"
                    value="hoodi"
                  >
                    <FaEthereum />
                    <Text
                      variant="body-3-medium"
                      className={cn("capitalize", {
                        "font-semibold": isHoodiEnvironment,
                      })}
                    >
                      Hoodi
                    </Text>
                    <div className="ml-auto mr-2 ">
                      {isHoodiEnvironment ? (
                        <Check className="size-3" />
                      ) : (
                        <LuExternalLink className="size-3" />
                      )}
                    </div>
                  </CommandItem>
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
