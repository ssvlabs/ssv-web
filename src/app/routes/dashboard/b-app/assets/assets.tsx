import type { FC } from "react";
import { Container } from "@/components/ui/container.tsx";
import { useBAppsAssets } from "@/hooks/b-app/use-assets";
import { AssetsTable } from "@/components/based-apps/assets-table/assets-table";
import { useNavigate } from "react-router";
import { Text } from "@/components/ui/text";
import { useGlobalNonSlashableAssets } from "@/hooks/b-app/use-global-non-slashable-assets";
import { GlobalNonSlashableAssetsTable } from "@/components/based-apps/global-non-slashable-assets-table/global-non-slashable-assets-table";

export const Assets: FC = () => {
  const { assets, query } = useBAppsAssets();
  const globalNonSlashableAssets = useGlobalNonSlashableAssets();
  const navigate = useNavigate();

  return (
    <Container variant="vertical" size="xl" className="py-6">
      <div className="h-10 flex justify-between w-full items-center">
        <Text variant="body-1-semibold">Assets</Text>
      </div>
      <GlobalNonSlashableAssetsTable
        data={globalNonSlashableAssets.data}
        isLoading={globalNonSlashableAssets.isLoading}
        onRowClick={() => navigate("accounts")}
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
