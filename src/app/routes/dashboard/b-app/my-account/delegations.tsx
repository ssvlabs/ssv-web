import { Text } from "@/components/ui/text.tsx";
import { Container } from "@/components/ui/container.tsx";
import { useNavigate } from "react-router-dom";
import { useMyBAppAccount } from "@/hooks/b-app/use-my-b-app-account.ts";
import { AccountAssetsTable } from "@/components/based-apps/account-assets-table/account-assets-table";
import { useAccountAssets } from "@/hooks/b-app/use-account-assets";
import { NonSlashableAssetsTable } from "@/components/based-apps/non-slashable-assets-table/non-slashable-assets-table";

const Delegations = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useMyBAppAccount();
  const { assets } = useAccountAssets();

  return (
    <Container variant="vertical" size="xl" className="py-6">
      <Text variant="body-1-semibold">My Assets</Text>
      <NonSlashableAssetsTable
        asset={data}
        isLoading={isLoading}
        onRowClick={() => navigate("/account/accounts")}
      />
      <AccountAssetsTable
        assets={assets}
        onRowClick={(asset) => {
          navigate(`/account/strategies?token=${asset.token}`);
        }}
        pagination={{
          page: 1,
          pages: 1,
          total: 1,
          per_page: 1,
        }}
      />
    </Container>
  );
};

export default Delegations;
