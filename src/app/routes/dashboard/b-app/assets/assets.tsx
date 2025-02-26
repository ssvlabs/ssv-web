import type { FC } from "react";
import { Container } from "@/components/ui/container.tsx";
import { useBAppsAssets } from "@/hooks/b-app/use-assets";
import { AssetsTable } from "@/components/based-apps/assets-table/assets-table";
import { useNavigate } from "react-router";
import { NonSlashableAssetsTable } from "@/components/based-apps/non-slashable-assets-table/non-slashable-assets-table";
import { useMyBAppAccount } from "@/hooks/b-app/use-my-b-app-account";
import type { NonSlashableAsset } from "@/api/b-app";
import { Text } from "@/components/ui/text";

export const Assets: FC = () => {
  const { assets, query } = useBAppsAssets();
  const navigate = useNavigate();
  const { data, isLoading } = useMyBAppAccount();

  const nonSlashableAssets: NonSlashableAsset[] = data
    ? [
        {
          id: "validator-balance",
          effectiveBalance: data.effectiveBalance,
          delegations: data.delegations,
        },
      ]
    : [];

  return (
    <Container variant="vertical" size="xl" className="py-6">
      <Text variant="body-1-semibold" className="mb-4">
        Assets
      </Text>
      <NonSlashableAssetsTable
        assets={nonSlashableAssets}
        isLoading={isLoading}
        onRowClick={() => navigate("/account/accounts")}
      />

      <AssetsTable
        onRowClick={(asset) => {
          navigate(`/account/strategies?token=${asset.token}`);
        }}
        assets={assets || []}
        pagination={{
          page: 1,
          per_page: 10,
          total: 10,
          pages: 1,
        }}
        isLoading={query.isLoading}
      />
    </Container>
  );
};

Assets.displayName = "Assets";
