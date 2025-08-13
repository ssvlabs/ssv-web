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
import { Tooltip } from "@/components/ui/tooltip";
import { SsvLogo } from "@/components/ui/ssv-logo";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { matchPath, NavLink, useLocation } from "react-router-dom";
import { useLinks } from "@/hooks/use-links";
import { useAccountState } from "@/hooks/account/use-account-state";
import { textVariants } from "@/components/ui/text";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import urlJoin from "url-join";

export type NavbarProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof NavbarProps> & NavbarProps
>;

export const Navbar: FCProps = ({ className, ...props }) => {
  const links = useLinks();
  const { accountRoutePath, dvtRoutePath } = useAccountState();
  const pathname = useLocation().pathname;
  const ssvNetworkDetails = useSSVNetworkDetails();
  const explorerUrl = urlJoin(
    links.ssv.explorer,
    ssvNetworkDetails.apiNetwork.toLowerCase(),
  );

  return (
    <div
      className={cn(
        className,
        "flex justify-center w-full border-b border-gray-300 dark:border-gray-100",
      )}
      {...props}
    >
      <div className="w-[1320px] flex items-center gap-3 h-20 whitespace-nowrap ">
        <div className="flex-1">
          <NavLink to={accountRoutePath ?? "/"} className="w-fit">
            <SsvLogo className="h-8" />
          </NavLink>
        </div>
        <div className="gap-6 items-center hidden min-[1140px]:flex">
          <NavLink
            to={accountRoutePath ?? "/"}
            className={textVariants({
              variant: "body-3-medium",
              className: cn({
                "text-primary-500":
                  matchPath("/account", pathname) ||
                  matchPath("/account/my-delegations", pathname) ||
                  matchPath("/account/my-strategies", pathname) ||
                  matchPath("/account/my-bApps", pathname) ||
                  matchPath("/account/accounts", pathname),
              }),
            })}
          >
            My Account
          </NavLink>
          <NavLink
            to="/account/assets"
            className={textVariants({
              variant: "body-3-medium",
              className: cn({
                "text-primary-500": matchPath("/account/assets/*", pathname),
              }),
            })}
          >
            Assets
          </NavLink>
          <NavLink
            to="/account/strategies"
            className={textVariants({
              variant: "body-3-medium",
              className: cn({
                "text-primary-500": matchPath(
                  "/account/strategies/*",
                  pathname,
                ),
              }),
            })}
          >
            Strategies
          </NavLink>
          <NavLink
            to="/account/bApps"
            className={textVariants({
              variant: "body-3-medium",
              className: cn({
                "text-primary-500": matchPath("/account/bApps/*", pathname),
              }),
            })}
          >
            bApps
          </NavLink>
          <NavLink
            to={dvtRoutePath}
            className={textVariants({
              variant: "body-3-medium",
              className: cn({
                "text-primary-500":
                  matchPath("/clusters/*", pathname) ||
                  matchPath("/operators/*", pathname) ||
                  matchPath("/join/*", pathname),
              }),
            })}
          >
            DVT
          </NavLink>
          <NavLink
            to={explorerUrl}
            target="_blank"
            className={textVariants({
              variant: "body-3-medium",
            })}
          >
            Explorer
          </NavLink>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              colorScheme="wallet"
              className={textVariants({
                variant: "body-3-medium",
                className: "size-12 rounded-xl",
              })}
            >
              <TbDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup className="min-[1140px]:hidden">
              <DropdownMenuItem className="h-[52px]" asChild>
                <NavLink
                  to={accountRoutePath ?? "/"}
                  className={textVariants({
                    className: cn({
                      "text-primary-500":
                        matchPath("/account", pathname) ||
                        matchPath("/account/my-delegations", pathname) ||
                        matchPath("/account/my-strategies", pathname) ||
                        matchPath("/account/my-bApps", pathname) ||
                        matchPath("/account/accounts", pathname),
                    }),
                  })}
                >
                  My Account
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="h-[52px]" asChild>
                <NavLink
                  to="/account/assets"
                  className={textVariants({
                    className: cn({
                      "text-primary-500": matchPath(
                        "/account/assets/*",
                        pathname,
                      ),
                    }),
                  })}
                >
                  Assets
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="h-[52px]" asChild>
                <NavLink
                  to="/account/strategies"
                  className={textVariants({
                    className: cn({
                      "text-primary-500": matchPath(
                        "/account/strategies/*",
                        pathname,
                      ),
                    }),
                  })}
                >
                  Strategies
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="h-[52px]" asChild>
                <NavLink
                  to="/account/bApps"
                  className={textVariants({
                    className: cn({
                      "text-primary-500": matchPath(
                        "/account/bApps/*",
                        pathname,
                      ),
                    }),
                  })}
                >
                  bApps
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="h-[52px]" asChild>
                <NavLink
                  to={dvtRoutePath}
                  className={textVariants({
                    className: cn({
                      "text-primary-500":
                        matchPath("/clusters/*", pathname) ||
                        matchPath("/operators/*", pathname) ||
                        matchPath("/join/*", pathname),
                    }),
                  })}
                >
                  DVT
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="h-[52px]" asChild>
                <NavLink to={explorerUrl} target="_blank">
                  Explorer <HiOutlineExternalLink className="text-gray-600" />
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
            <a href={links.ssv.docs} target="_blank">
              <DropdownMenuItem className="h-[52px]">
                Docs <HiOutlineExternalLink className="text-gray-600" />
              </DropdownMenuItem>
            </a>
            <DropdownMenuSeparator />
            <a href={links.ssv.governanceForum} target="_blank">
              <DropdownMenuItem className="h-[52px]">
                Governance Forum{" "}
                <HiOutlineExternalLink className="text-gray-600" />
              </DropdownMenuItem>
            </a>
            <DropdownMenuSeparator />
            <a href={links.ssv.snapshot} target="_blank">
              <DropdownMenuItem className="h-[52px]">
                Snapshot <HiOutlineExternalLink className="text-gray-600" />
              </DropdownMenuItem>
            </a>
            <DropdownMenuSeparator />
            <a href={links.ssv.tos} target="_blank">
              <DropdownMenuItem className="h-[52px]">
                Terms of Use <HiOutlineExternalLink className="text-gray-600" />
              </DropdownMenuItem>
            </a>
            <DropdownMenuSeparator />
            <a href={links.ssv.privacy} target="_blank">
              <DropdownMenuItem className="h-[52px]">
                Privacy Policy{" "}
                <HiOutlineExternalLink className="text-gray-600" />
              </DropdownMenuItem>
            </a>
            <DropdownMenuSeparator />
            <div className="flex px-1 pb-1 text-gray-700">
              <a href={links.ssv.discord} target="_blank">
                <Tooltip delayDuration={500} content="Discord">
                  <DropdownMenuItem className="p-3 rounded-xl">
                    <FaDiscord className="size-6" />
                  </DropdownMenuItem>
                </Tooltip>
              </a>
              <a href={links.ssv.x} target="_blank">
                <Tooltip delayDuration={500} content="X">
                  <DropdownMenuItem className="p-3 rounded-xl">
                    <FaXTwitter className="size-6" />
                  </DropdownMenuItem>
                </Tooltip>
              </a>
              <a href={links.ssv.website} target="_blank">
                <Tooltip delayDuration={500} content="ssv.network website">
                  <DropdownMenuItem className="p-3 rounded-xl">
                    <HiOutlineGlobeAlt className="size-6" />
                  </DropdownMenuItem>
                </Tooltip>
              </a>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
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
