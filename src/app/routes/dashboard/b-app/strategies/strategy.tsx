import { Container } from "@/components/ui/container.tsx";
import { Text } from "@/components/ui/text.tsx";
import { convertToPercentage, formatSSV } from "@/lib/utils/number.ts";
import { useStrategy } from "@/hooks/b-app/use-strategy.ts";
import { shortenAddress } from "@/lib/utils/strings.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { StrategyAssetsTable } from "@/components/based-apps/strategy-assets-table/strategy-assets-table.tsx";
import { StrategyBAppsTable } from "@/components/based-apps/strategy-b-apps-table/strategy-b-apps-table.tsx";
import { SearchInput } from "@/components/ui/search-input.tsx";
import { useState } from "react";
import { Tooltip } from "@/components/ui/tooltip.tsx";
import { FaCircleInfo } from "react-icons/fa6";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/tw.ts";
import { SsvLoader } from "@/components/ui/ssv-loader.tsx";
import { useAssetsDelegationModal } from "@/signals/modal";

const Strategy = () => {
  const { strategy, isLoading } = useStrategy();
  const [assetSearchValue, setAssetSearchValue] = useState("");
  const [bAppSearchValue, setBAppSearchValue] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  if (isLoading)
    return (
      <motion.div
        className={cn(
          "fixed flex-col gap-1 bg-gray-50 inset-0 flex h-screen items-center justify-center",
        )}
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <SsvLoader className={"size-[160px]"} />
      </motion.div>
    );
  const strategyData = [
    {
      label: "Fee",
      value: `${convertToPercentage(strategy.fee)}%`,
    },
    {
      label: "Delegators",
      value: strategy.totalDelegators,
      tooltipText:
        "The total number of accounts that have delegated to this strategy and/or strategy owner.",
    },
    {
      label: "Total Delegated Value",
      value: formatSSV((strategy.totalDelegatedFiat || 0n) as bigint, 18),
      tooltipText: "Combined value of all delegated assets.",
    },
    {
      label: "Strategy Owner",
      value: (
        <div className="flex items-center gap-2">
          <img
            className="rounded-[8px] size-7 border-gray-400 border"
            src={"/images/operator_default_background/light.svg"}
            onError={(e) => {
              e.currentTarget.src =
                "/images/operator_default_background/light.svg";
            }}
          />
          {shortenAddress(strategy?.ownerAddress || "0x")}
        </div>
      ),
    },
  ];

  return (
    <Container variant="vertical" size="xl" className="py-6">
      <div className="flex items-center gap-2 text-gray-500">
        <Text
          onClick={() => navigate(-1)}
          className="text-gray-500 cursor-pointer"
          variant="body-3-semibold"
        >
          {location.pathname.includes("strategies")
            ? "Strategies"
            : "My Account"}{" "}
          {">"} {strategy.name}
        </Text>
      </div>
      <div className="flex items-center gap-2">
        <Text variant="body-1-semibold">{strategy.name}</Text>
      </div>
      <div className="h-[100px] w-full flex items-center gap-10 rounded-[16px] bg-white p-6">
        {strategyData.map(({ label, value, tooltipText }) => (
          <div className="w-[288px] flex-col items-center gap-1">
            <Text
              className="text-gray-500 flex items-center gap-2"
              variant={"caption-medium"}
            >
              {label}
              {tooltipText && (
                <Tooltip content={tooltipText}>
                  <FaCircleInfo className="size-3 text-gray-500" />
                </Tooltip>
              )}
            </Text>
            <Text variant={"body-1-medium"}>{value as string}</Text>
          </div>
        ))}
      </div>
      <Text variant="body-1-semibold">Assets</Text>
      <Table className={"w-full rounded-t-xl overflow-hidden"}>
        <TableHeader>
          <TableHead>Non Slashable Assets</TableHead>
          <TableHead>Total Delegated</TableHead>
          <TableHead>Total Delegated Value</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <div className="flex gap-2 w-[c320px]">
                <img
                  className={"h-[24px] w-[15px]"}
                  src={`/images/balance-validator/balance-validator.svg`}
                />
                Validator Balance
                <Text className="text-gray-500 font-medium">ETH</Text>
              </div>
            </TableCell>
            <TableCell>
              {formatSSV((strategy.totalNonSlashableTokens || 0n) as bigint, 9)}{" "}
              ETH
            </TableCell>
            <TableCell>
              {formatSSV((strategy.totalNonSlashableFiat || 0n) as bigint, 9)} $
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {Boolean(strategy.delegationsPerToken?.length) && (
        <div className="w-full flex flex-col gap-6">
          <div className="flex justify-between w-full items-center">
            <Text variant="body-1-semibold">Supported Assets</Text>
            <SearchInput
              onChange={(e) => setAssetSearchValue(e.target.value)}
              placeholder="Search"
              iconPlacement="left"
              className="h-10 rounded-xl bg-gray-50 text-sm w-[536px] max-w-full"
              inputProps={{
                className: "bg-gray-50",
                placeholder: "Search Strategy...",
              }}
            />
          </div>
          <StrategyAssetsTable
            onDepositClick={(asset) => {
              useAssetsDelegationModal.state.open({
                asset: asset.token,
                strategy,
              });
            }}
            searchValue={assetSearchValue}
            showDepositButtonOnHover
            assets={strategy.delegationsPerToken || []}
          />
        </div>
      )}
      {Boolean(strategy.bAppsList?.length) && (
        <div className="w-full flex flex-col gap-6">
          <div className="flex justify-between w-full items-center">
            <Text variant="body-1-semibold">Supported bApps</Text>
            <SearchInput
              onChange={(e) => setBAppSearchValue(e.target.value)}
              placeholder="Search"
              iconPlacement="left"
              className="h-10 rounded-xl bg-gray-50 text-sm w-[536px] max-w-full"
              inputProps={{
                className: "bg-gray-50",
                placeholder: "Search Strategy...",
              }}
            />
          </div>
          {strategy.bAppsList && (
            <StrategyBAppsTable
              searchValue={bAppSearchValue}
              bApps={strategy.bAppsList}
            />
          )}
        </div>
      )}
    </Container>
  );
};

export default Strategy;
