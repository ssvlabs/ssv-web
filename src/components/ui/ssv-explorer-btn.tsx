import type { FC } from "react";
import { cn } from "@/lib/utils/tw";
import type { ButtonProps } from "@/components/ui/button";
import { Button, IconButton } from "@/components/ui/button";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { Tooltip } from "@/components/ui/tooltip";
import { MdOutlineTravelExplore } from "react-icons/md";
import { omit } from "lodash-es";
import urlJoin from "url-join";
import { useLinks } from "@/hooks/use-links";
import { LuSatelliteDish } from "react-icons/lu";

export type SsvExplorerBtnProps =
  | {
      operatorId: string | number;
    }
  | {
      validatorId: string;
    };

type SsvExplorerBtnFC = FC<
  Omit<ButtonProps, keyof SsvExplorerBtnProps> & SsvExplorerBtnProps
>;

export const SsvExplorerBtn: SsvExplorerBtnFC = ({ className, ...props }) => {
  const network = useSSVNetworkDetails();
  const isOperator = "operatorId" in props;

  const id = isOperator
    ? (props as { operatorId: string | number }).operatorId
    : (props as { validatorId: string }).validatorId;

  const clearedProps = omit(props, ["operatorId", "validatorId"]);
  const href = urlJoin(
    network.explorerUrl,
    isOperator ? "operators" : "validators",
    id.toString(),
  );

  return (
    <Tooltip
      asChild
      content={isOperator ? "Explore Operator" : "Explore Validator"}
    >
      <Button
        as="a"
        href={href}
        onClick={(ev) => ev.stopPropagation()}
        target="_blank"
        size="icon"
        variant="subtle"
        className={cn("size-7 text-gray-700", className)}
        {...clearedProps}
      >
        <MdOutlineTravelExplore className="size-[65%]" />
      </Button>
    </Tooltip>
  );
};

SsvExplorerBtn.displayName = "SsvExplorerBtn";

export type BeaconchainBtnProps = {
  validatorId: string;
};

type BeaconchainBtnFC = FC<
  Omit<ButtonProps, keyof BeaconchainBtnProps> & BeaconchainBtnProps
>;

export const BeaconchainBtn: BeaconchainBtnFC = ({ validatorId, ...props }) => {
  const links = useLinks();

  return (
    <Tooltip asChild content={"Beaconchain"}>
      <IconButton
        as="a"
        href={`${links.beaconcha}/validator/${validatorId}`}
        target="_blank"
        {...props}
      >
        <LuSatelliteDish />
      </IconButton>
    </Tooltip>
  );
};
