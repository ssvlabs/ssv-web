import type { FC } from "react";
import { Container } from "@/components/ui/container.tsx";
import { useBAppsAssets } from "@/hooks/b-app/use-assets";
import { AssetsTable } from "@/components/based-apps/assets-table/assets-table";
import { useNavigate } from "react-router";

export const Assets: FC = () => {
  const { assets, query } = useBAppsAssets();
  const navigate = useNavigate();

  return (
    <Container variant="vertical" size="xl" className="py-6">
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
