import type { FC } from "react";
import { Container } from "@/components/ui/container.tsx";
import { useBAppsAssets } from "@/hooks/b-app/use-assets";
import { AssetsTable } from "@/components/based-apps/assets-table/assets-table";

export const Assets: FC = () => {
  const assets = useBAppsAssets();

  return (
    <Container variant="vertical" size="xl" className="py-6">
      <AssetsTable
        assets={assets.data || []}
        pagination={{
          page: 1,
          per_page: 10,
          total: 10,
          pages: 1,
        }}
        isLoading={assets.isLoading}
      />
    </Container>
  );
};

Assets.displayName = "Assets";
