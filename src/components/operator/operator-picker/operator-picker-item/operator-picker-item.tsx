import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { MevRelays } from "@/components/operator/operator-picker/operator-picker-item/mev-relays/mev-relays";
import { OperatorStatusBadge } from "@/components/operator/operator-status-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/grid-table";
import { SsvExplorerBtn } from "@/components/ui/ssv-explorer-btn";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { useGetValidatorsPerOperatorLimit } from "@/lib/contract-interactions/read/use-get-validators-per-operator-limit";
import { percentageFormatter } from "@/lib/utils/number";
import { canAccountUseOperator, getYearlyFee } from "@/lib/utils/operator";
import { cn } from "@/lib/utils/tw";
import type { Operator } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import type { ComponentPropsWithoutRef, FC } from "react";
import { LuLogIn } from "react-icons/lu";
import { Link } from "react-router-dom";
import type { Address } from "viem";
import { isAddressEqual } from "viem";
import { useAccount } from "@/hooks/account/use-account";
import VerifiedSVG from "@/assets/images/verified.svg?react";
import { useChainId } from "wagmi";
import { useLocalStorage } from "react-use";

export type OperatorPickerItemProps = {
  operator: Operator;
  isSelected?: boolean;
  isDisabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"label">, keyof OperatorPickerItemProps> &
    OperatorPickerItemProps
>;

export const OperatorPickerItem: FCProps = ({
  className,
  operator,
  onCheckedChange,
  isSelected,
  isDisabled,
  ...props
}) => {
  const { address } = useAccount();
  const { data: maxValidatorsPerOperator = 0 } =
    useGetValidatorsPerOperatorLimit();
  const [skipValidation] = useLocalStorage("skipValidatorsMaxCount", false);

  const reachedMaxValidators =
    !skipValidation &&
    operator.validators_count + 1 >= maxValidatorsPerOperator;

  const hasValidators = operator.validators_count !== 0;
  const isInactive = operator.is_active < 1;

  const chainId = useChainId();

  const isUsable = useQuery({
    queryKey: ["operator-usable", operator, chainId],
    queryFn: () => canAccountUseOperator(address!, operator),
  });

  const disabled =
    isDisabled || reachedMaxValidators || isUsable.isLoading || !isUsable.data;

  return (
    <Tooltip
      asChild
      content={
        reachedMaxValidators
          ? "Operator reached maximum amount of validators"
          : undefined
      }
    >
      <TableRow
        as="label"
        htmlFor={operator.id.toString()}
        className={cn(
          "items-center h-[85px]",
          {
            "opacity-50": disabled,
            "bg-primary-100": isSelected,
          },
          className,
        )}
        {...props}
      >
        <TableCell>
          <Checkbox
            checked={isSelected}
            id={operator.id.toString()}
            onCheckedChange={disabled ? undefined : onCheckedChange}
          ></Checkbox>
        </TableCell>
        <TableCell>
          <div className="size-10 flex flex-nowrap text-nowrap items-center gap-2">
            <OperatorAvatar
              size="md"
              className="ml-2"
              src={operator.logo}
              isPrivate={operator.is_private}
            />
            <div className="flex flex-col gap-0.5">
              <Text
                className="flex-1 text-ellipsis overflow-hidden"
                title={operator.name}
                variant={isSelected ? "body-3-semibold" : "body-3-medium"}
              >
                {operator.name}{" "}
                {operator.type === "verified_operator" && (
                  <VerifiedSVG className="inline" />
                )}
              </Text>
              <Text variant="caption-medium" className="text-gray-500">
                ID: {operator.id}
              </Text>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="size-10">{operator.validators_count}</div>
        </TableCell>
        <TableCell
          className={cn("flex h-full justify-center flex-col  items-start", {
            "text-error-500": hasValidators && isInactive,
          })}
        >
          <div className="h-10">
            <Text variant={isSelected ? "body-2-semibold" : "body-2-medium"}>
              {percentageFormatter.format(operator.performance["30d"])}
            </Text>
            {isInactive && (
              <OperatorStatusBadge size="xs" status={operator.status} />
            )}
          </div>
        </TableCell>
        <TableCell
          className={cn({
            "font-semibold": isSelected,
          })}
        >
          <div className="h-10">
            {getYearlyFee(BigInt(operator.fee), { format: true })}
          </div>
        </TableCell>
        <TableCell>
          <MevRelays
            mevRelays={operator.mev_relays}
            className={cn({
              "font-semibold": isSelected,
            })}
          />
        </TableCell>
        <TableCell className="flex gap-1 justify-end">
          <div className="size-10">
            <SsvExplorerBtn operatorId={operator.id} />
            {isAddressEqual(operator.owner_address as Address, address!) && (
              <Button
                as={Link}
                to={`/operators/${operator.id}`}
                variant="subtle"
                size="icon"
              >
                <LuLogIn />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    </Tooltip>
  );
};

OperatorPickerItem.displayName = "OperatorPickerItem";
