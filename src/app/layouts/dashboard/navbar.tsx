import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiOutlineExternalLink, HiOutlineGlobeAlt } from "react-icons/hi";
import { TbDotsVertical } from "react-icons/tb";

import { ConnectWalletBtn } from "@/components/connect-wallet/connect-wallet-btn";
import { NetworkSwitchBtn } from "@/components/connect-wallet/network-switch-btn";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { SsvLogo } from "@/components/ui/ssv-logo";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Link } from "react-router-dom";
import { useLinks } from "@/hooks/use-links";
import { useAccountState } from "@/hooks/account/use-account-state";

export type NavbarProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof NavbarProps> & NavbarProps
>;

export const Navbar: FCProps = ({ className, ...props }) => {
  const links = useLinks();
  const { accountRoutePath, dvtRoutePath } = useAccountState();
  return (
    <div
      className={cn(className, "flex justify-center w-full bg-gray-50")}
      {...props}
    >
      <div className="w-[1320px] flex items-center gap-6 h-20 whitespace-nowrap">
        <Link to={accountRoutePath ?? "/"}>
          <SsvLogo className="h-full mr-[253px]" />
        </Link>
        {/*<Spacer className="w-[253px]" />*/}
        <Text as={Link} to={accountRoutePath} variant="body-2-medium">
          My Account
        </Text>
        <Text as={Link} to={accountRoutePath} variant="body-2-medium">
          Assets
        </Text>
        <Text as={Link} to={accountRoutePath} variant="body-2-medium">
          Strategies
        </Text>
        <Text as={Link} to={accountRoutePath} variant="body-2-medium">
          Services
        </Text>
        <Text as={Link} to={dvtRoutePath} variant="body-2-medium">
          DVT
        </Text>
        <Text
          as="a"
          href={links.ssv.explorer}
          target="_blank"
          variant="body-2-medium"
        >
          Explorer
        </Text>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <TbDotsVertical className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <a href={links.ssv.governanceForum} target="_blank">
              <DropdownMenuItem>
                Governance Forum{" "}
                <HiOutlineExternalLink className="text-gray-600" />
              </DropdownMenuItem>
            </a>
            <a href={links.ssv.snapshot} target="_blank">
              <DropdownMenuItem>
                Snapshot <HiOutlineExternalLink className="text-gray-600" />
              </DropdownMenuItem>
            </a>
            <DropdownMenuSeparator />
            <a href={links.ssv.tos} target="_blank">
              <DropdownMenuItem>
                Terms of Use <HiOutlineExternalLink className="text-gray-600" />
              </DropdownMenuItem>
            </a>
            <a href={links.ssv.privacy} target="_blank">
              <DropdownMenuItem>
                Privacy Policy{" "}
                <HiOutlineExternalLink className="text-gray-600" />
              </DropdownMenuItem>
            </a>
            <div className="flex px-1 pb-1 text-gray-700">
              <a href={links.ssv.discord} target="_blank">
                <Tooltip delayDuration={500} content="Discord">
                  <DropdownMenuItem className="p-3 rounded-xl">
                    <FaDiscord className="size-4" />
                  </DropdownMenuItem>
                </Tooltip>
              </a>
              <a href={links.ssv.x} target="_blank">
                <Tooltip delayDuration={500} content="X">
                  <DropdownMenuItem className="p-3 rounded-xl">
                    <FaXTwitter className="size-4" />
                  </DropdownMenuItem>
                </Tooltip>
              </a>
              <a href={links.ssv.website} target="_blank">
                <Tooltip delayDuration={500} content="ssv.network website">
                  <DropdownMenuItem className="p-3 rounded-xl">
                    <HiOutlineGlobeAlt className="size-4" />
                  </DropdownMenuItem>
                </Tooltip>
              </a>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-3 w-[392px]">
          <NetworkSwitchBtn />
          <ConnectWalletBtn />
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  );
};

Navbar.displayName = "Navbar";
