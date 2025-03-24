import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";

import { ConnectWalletBtn } from "@/components/connect-wallet/connect-wallet-btn";
import { NetworkSwitchBtn } from "@/components/connect-wallet/network-switch-btn";

import { SsvLogo } from "@/components/ui/ssv-logo";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export type NavbarProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof NavbarProps> & NavbarProps
>;

export const Navbar: FCProps = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        className,
        "flex justify-center w-full border-b border-gray-300 dark:border-gray-100",
      )}
      {...props}
    >
      <div className="w-[1320px] flex items-center gap-3 h-20 whitespace-nowrap">
        <div className="flex-1">
          <SsvLogo className="h-8" />
        </div>

        <div className="flex items-center gap-3">
          <NetworkSwitchBtn />
          <ConnectWalletBtn />
        </div>
        <ThemeSwitcher className="ml-3" />
      </div>
    </div>
  );
};

Navbar.displayName = "Navbar";
