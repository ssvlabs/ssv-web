import { Container } from "@/components/ui/container.tsx";
import { Text } from "@/components/ui/text.tsx";
import {
  convertToPercentage,
  currencyFormatter,
  formatSSV,
} from "@/lib/utils/number.ts";
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
import { type ChangeEvent, useState } from "react";
import { Tooltip } from "@/components/ui/tooltip.tsx";
import { FaCircleInfo } from "react-icons/fa6";
import { useLocation } from "react-router";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/tw.ts";
import { SsvLoader } from "@/components/ui/ssv-loader.tsx";
import { useAssetsDelegationModal } from "@/signals/modal";
import DescriptionCard from "@/components/ui/description-card.tsx";
import Delegate from "@/app/routes/dashboard/b-app/my-account/delegate.tsx";
import { getStrategyName } from "@/lib/utils/strategy";
import { formatGwei, isAddress } from "viem";
import { useGetAsset } from "@/hooks/b-app/use-get-asset.tsx";
import { CopyBtn } from "@/components/ui/copy-btn.tsx";
import { useDelegateContext } from "@/components/context/delegate-context.tsx";

const Strategy = () => {
  const { strategy, account, isLoading: isStrategyLoading } = useStrategy();
  const [bAppSearchValue, setBAppSearchValue] = useState("");
  const [isOpenDelegateModal, setIsOpenDelegateModal] = useState(false);
  const { setDelegationData } = useDelegateContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchedValue = searchParams.get("asset");
  const { searchAssets } = useGetAsset(
    (searchedValue || "0x") as `0x${string}`,
  );

  const receiver = (account.delegations || []).filter(
    (receiver) =>
      receiver.receiver.id.toLowerCase() ===
      strategy.ownerAddress?.toLowerCase(),
  )[0];
  const openDelegate = () => {
    if (setDelegationData) {
      setDelegationData({
        name: account.name,
        logo: account.logo,
        percentage: receiver?.percentage,
        delegatedValue: (
          (convertToPercentage(receiver?.percentage || 0) *
            (Number(formatGwei(account?.effectiveBalance || 0n)) || 0)) /
          100
        ).toFixed(4),
        delegateAddress: strategy.ownerAddress,
      });
    }
    setIsOpenDelegateModal(true);
  };
  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("asset", e.target.value);
      return params;
    });
  };

  if (isStrategyLoading)
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
      tooltipText: "Total number of unique delegators to this strategy’s owner",
    },
    {
      label: "Depositors",
      value: strategy.totalDeposited,
      tooltipText: "Total number of unique depositors to this strategy",
    },
    {
      label: "Total Asset Value",
      value: currencyFormatter.format(Number(strategy.totalDepositedFiat) || 0),
      tooltipText: "Total value of all deposits made to this strategy",
    },
    {
      label: "Strategy Owner",
      value: (
        <div className="flex items-center gap-2">
          <img
            className="size-6 rounded-[8px] border-gray-400 border"
            src={
              account?.logo || "/images/operator_default_background/light.svg"
            }
            onError={(e) => {
              e.currentTarget.src =
                "/images/operator_default_background/light.svg";
            }}
          />
          {account?.name
            ? isAddress(account?.name)
              ? shortenAddress(account?.name)
              : account?.name
            : shortenAddress(strategy?.ownerAddress)}
          <Tooltip
            content={`Copy Address: ${shortenAddress(strategy.ownerAddress)}`}
          >
            <div className="flex items-center justify-center">
              <CopyBtn text={strategy.ownerAddress} />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Container variant="vertical" size="xl" className="py-6">
      <div className="flex items-center gap-2 text-gray-500">
        <Text
          onClick={() =>
            location.pathname.includes("my-strategies")
              ? navigate("/account/my-strategies")
              : navigate("/account/strategies")
          }
          className="text-gray-500 cursor-pointer"
          variant="body-3-medium"
        >
          {location.pathname.includes("my-strategies")
            ? "My Account"
            : "Strategies"}{" "}
          {">"} {getStrategyName(strategy)}
        </Text>
      </div>
      <div className="flex items-center gap-2">
        <Text variant="body-1-semibold">{getStrategyName(strategy)}</Text>
      </div>
      <div className="w-full flex flex-col gap-6 rounded-[16px] bg-white p-6">
        <div className="w-full flex items-center ">
          {strategyData.map(({ label, value, tooltipText }) => (
            <div className="w-full flex flex-col gap-1">
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
        {strategy.description && (
          <DescriptionCard description={strategy.description} />
        )}
      </div>
      <div className="flex justify-between w-full items-center">
        <Text variant="body-1-semibold">Assets</Text>
        <SearchInput
          onChange={onSearchChange}
          value={searchedValue || ""}
          placeholder="Search"
          iconPlacement="left"
          className={`h-10 rounded-xl bg-gray-50 text-sm w-[536px] max-w-full ${
            searchedValue &&
            !isAddress(searchedValue || "0x") &&
            !searchAssets.length &&
            "border-error-500 focus-within:border-error-500"
          }`}
          inputProps={{
            className: "bg-gray-50",
            placeholder: "Search Asset Address...",
          }}
        />
      </div>
      {searchedValue && !searchAssets.length && (
        <div className="w-full h-[104px] bg-white flex justify-center items-center rounded-[16px]">
          <Text variant="body-3-medium" className="text-gray-600">
            {isAddress(searchedValue || "0x")
              ? "Asset was not found"
              : "Invalid address format"}
          </Text>
        </div>
      )}
      {!searchedValue && (
        <div className="w-full rounded-b-[16px]">
          <Table
            className={"w-full rounded-t-xl overflow-hidden rounded-b-[16px]"}
          >
            <TableHeader>
              <TableHead className="size-[28%]">Delegatable Asset</TableHead>
              <TableHead className="size-[15%]"></TableHead>
              <TableHead className="size-[15%]"></TableHead>
              <TableHead className=" flex items-center gap-1">
                Total Delegated
                <Tooltip
                  content={
                    "Total effective balance (ETH) delegated to the owner of this strategy"
                  }
                >
                  <FaCircleInfo className="text-gray-500" />
                </Tooltip>
              </TableHead>
              <TableHead className="size-[19%]">
                Total Delegated Value
              </TableHead>
            </TableHeader>
            <TableBody>
              <TableRow onClick={openDelegate}>
                <TableCell className="size-[28%]">
                  <div className="flex gap-2 w-[c320px]">
                    <img
                      className={"h-[24px] w-[15px]"}
                      src={`/images/balance-validator/balance-validator.svg`}
                    />
                    Validator Balance
                    <Text className="text-gray-500 font-medium">ETH</Text>
                  </div>
                </TableCell>
                <TableCell className="size-[15%]"></TableCell>
                <TableCell className="size-[15%]"></TableCell>
                <TableCell>
                  {formatSSV(strategy.totalDelegatedValue || 0n)} ETH
                </TableCell>
                <TableCell>
                  {currencyFormatter.format(
                    Number(strategy.totalDelegatedFiat) || 0,
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {(searchedValue
        ? Boolean(searchAssets.length)
        : Boolean(strategy.depositsPerToken?.length)) && (
        <div className="w-full flex flex-col gap-6">
          <StrategyAssetsTable
            onDepositClick={(asset) => {
              useAssetsDelegationModal.state.open({
                asset: asset.token,
                strategyId: strategy.id,
              });
            }}
            showDepositButtonOnHover
            assets={
              searchedValue ? searchAssets : strategy.depositsPerToken || []
            }
          />
        </div>
      )}
      <div className="w-full flex flex-col gap-6">
        <div className="flex justify-between w-full items-center">
          <Text variant="body-1-semibold">Supported bApps</Text>
          {!!strategy.bAppsList?.length && (
            <SearchInput
              onChange={(e) => setBAppSearchValue(e.target.value)}
              placeholder="Search"
              iconPlacement="left"
              className="h-10 rounded-xl bg-gray-50 text-sm w-[536px] max-w-full"
              inputProps={{
                className: "bg-gray-50",
                placeholder: "Search bApp...",
              }}
            />
          )}
        </div>
        {strategy.bAppsList && (
          <StrategyBAppsTable
            isLoading={isStrategyLoading}
            searchValue={bAppSearchValue}
            bApps={strategy.bAppsList}
          />
        )}
      </div>
      {isOpenDelegateModal && (
        <Delegate
          isUpdateFlow={!!receiver}
          closeDelegatePopUp={() => setIsOpenDelegateModal(false)}
        />
      )}
    </Container>
  );
};

export default Strategy;
