import { StrategiesTable } from "@/components/based-apps/strategies-table/strategies-table";
import { BAppLogo } from "@/components/ui/b-app-logo";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Loading } from "@/components/ui/Loading";
import { SearchInput } from "@/components/ui/search-input";
import { Stat } from "@/components/ui/stat";
import { Text } from "@/components/ui/text";
import { useBApp } from "@/hooks/b-app/use-b-app";
import { useBAppPageParams } from "@/hooks/b-app/use-bapp-page-params";
import { useStrategies } from "@/hooks/b-app/use-strategies";
import { currencyFormatter } from "@/lib/utils/number";
import { shortenAddress } from "@/lib/utils/strings";
import { parseAsString, useQueryState } from "nuqs";
import { Link, useNavigate } from "react-router-dom";
import { BAppNonSlashableAssetsTable } from "@/components/based-apps/b-app-non-slashable-table/b-app-non-slashable-assets-table.tsx";
import BAppSlashableAssetsTable from "@/components/based-apps/b-app-slashable-assets-table/b-app-slashable-assets-table.tsx";

export const BApp = () => {
  const { bAppId } = useBAppPageParams();
  const { bApp, isLoading } = useBApp(bAppId);
  const navigate = useNavigate();
  const [strategyId, setStrategyId] = useQueryState(
    "strategyId",
    parseAsString,
  );

  const { strategies, pagination, isStrategiesLoading } = useStrategies(
    strategyId || undefined,
    bAppId || undefined,
  );

  if (!bApp || isLoading) {
    return <Loading />;
  }

  const bAppName = bApp?.name || `bApp ${shortenAddress(bAppId!)}`;

  return (
    <Container variant="vertical" size="xl" className="py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate(-1)}>bApps</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{bAppName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BAppLogo
            src={bApp.logo}
            variant="unstyled"
            className="size-10 rounded-lg"
          />
          <Text variant="body-1-semibold">{bAppName}</Text>
        </div>
      </div>

      <Card className="w-full">
        <div className="flex [&>*]:flex-1  [&>*:not(:last-child)]:border-r [&>*:not(:last-child)]:border-gray-200 gap-5">
          <Stat title="Strategies" content={bApp.strategies} />
          <Stat title="Delegators" content={bApp.delegators} />
          <Stat
            title="Total Delegated Value"
            content={currencyFormatter.format(+bApp.totalDelegatedValue)}
          />
          <div className="flex items-center gap-2">
            <Stat
              title="bApp ID"
              content={shortenAddress(bApp.id || "0x")}
              copyBtnText={bApp.id || ""}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="bg-gray-200 p-2 pl-3 rounded-[12px]">
            <Text variant="body-3-medium">
              {bApp.description || "No description available for this bApp."}
            </Text>
          </div>

          <div className="bg-gray-200 p-2 pl-3 rounded-[12px]">
            <Text variant="body-3-medium">
              {bApp.website ? (
                <a
                  href={bApp.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {bApp.website}
                </a>
              ) : (
                "No website available for this bApp."
              )}
            </Text>
          </div>
        </div>
      </Card>

      <div className="flex justify-between w-full items-center">
        <Text variant="body-1-semibold">Strategies</Text>
        <SearchInput
          onChange={(e) => setStrategyId(e.target.value)}
          placeholder="Search"
          iconPlacement="left"
          className="h-10 rounded-xl bg-gray-50 text-sm w-[536px] max-w-full"
          inputProps={{
            className: "bg-gray-50",
            placeholder: "Search Strategy...",
          }}
        />
      </div>
      {!isStrategiesLoading && !strategies?.length ? (
        <Card className="w-full h-[160px] flex flex-col items-center justify-center gap-4">
          <Text variant="body-3-medium" className="text-gray-500">
            No strategy has opted into this bApp yet
          </Text>
          <Button
            as={Link}
            to={"/account/strategies"}
            variant="default"
            size="lg"
          >
            Explore Strategies
          </Button>
        </Card>
      ) : (
        <StrategiesTable
          strategies={strategies}
          pagination={pagination}
          isLoading={isStrategiesLoading}
        />
      )}
      <div className="flex justify-between w-full items-center">
        <Text variant="body-1-semibold">Assets</Text>
        <SearchInput
          onChange={(e) => setStrategyId(e.target.value)}
          placeholder="Search"
          iconPlacement="left"
          className="h-10 rounded-xl bg-gray-50 text-sm w-[536px] max-w-full"
          inputProps={{
            className: "bg-gray-50",
            placeholder: "Search Asset Address...",
          }}
        />
      </div>
      <BAppNonSlashableAssetsTable
        asset={{
          delegatedAccounts: bApp.delegatedAccounts,
          totalDelegatedValue: bApp.totalDelegatedValue,
          totalDelegatedValueNonSlashable: bApp.totalDelegatedValueNonSlashable,
        }}
        isLoading={isLoading}
      />

      <BAppSlashableAssetsTable
        assets={bApp.delegatedSlashable}
        pagination={pagination}
      />
    </Container>
  );
};
