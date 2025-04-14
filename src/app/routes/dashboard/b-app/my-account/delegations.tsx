import { Text } from "@/components/ui/text.tsx";
import { Container } from "@/components/ui/container.tsx";
import { useNavigate } from "react-router-dom";
import { useMyBAppAccount } from "@/hooks/b-app/use-my-b-app-account.ts";
import { useAccountAssets } from "@/hooks/b-app/use-account-assets";
import MyAccountWrapper, {
  AccountSelect,
} from "@/app/routes/dashboard/b-app/my-account/my-account-wrapper.tsx";
import { NonSlashableAssetsTable } from "@/components/based-apps/non-slashable-assets-table/non-slashable-assets-table.tsx";
import { AccountAssetsTable } from "@/components/based-apps/account-assets-table/account-assets-table.tsx";
import Delegate from "@/app/routes/dashboard/b-app/my-account/delegate.tsx";
import { useState } from "react";
import { useAssetWithdrawalModal } from "@/signals/modal";
import type { AccountMetadata } from "@/api/b-app.ts";
import { useDelegateContext } from "@/components/context/delegate-context.tsx";

const Delegations = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useMyBAppAccount();
  const { assets } = useAccountAssets();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { setDelegationData, reset } = useDelegateContext();

  const updateDelegatedValue = (
    address: string,
    delegatedValue: number,
    percentage: string,
    metadata?: AccountMetadata,
  ) => {
    setIsOpenModal(true);
    if (setDelegationData) {
      setDelegationData({
        ...metadata,
        percentage,
        delegateAddress: address,
        delegatedValue: delegatedValue.toString(),
      });
    }
  };

  const assetWithdrawalModal = useAssetWithdrawalModal();
  return (
    <MyAccountWrapper filter={AccountSelect.Delegations}>
      <Container variant="vertical" size="xl">
        <div className="h-10 flex justify-between w-full items-center">
          <Text variant="body-1-semibold">My Assets</Text>
        </div>
        <NonSlashableAssetsTable
          updateDelegatedValue={updateDelegatedValue}
          asset={data}
          isLoading={isLoading}
          onRowClick={() => navigate("/account/accounts")}
        />
        <AccountAssetsTable
          assets={assets}
          onRowClick={(asset) => {
            navigate(`/account/strategies?token=${asset.token}`);
          }}
          onWithdrawClick={(props) => {
            assetWithdrawalModal.open(props);
          }}
          pagination={{
            page: 1,
            pages: 1,
            total: 1,
            per_page: 1,
          }}
        />
      </Container>
      {isOpenModal && (
        <Delegate
          isUpdateFlow
          closeDelegatePopUp={() => {
            setIsOpenModal(false);
            reset();
            navigate("/account/my-delegations");
          }}
        />
      )}
    </MyAccountWrapper>
  );
};

export default Delegations;
