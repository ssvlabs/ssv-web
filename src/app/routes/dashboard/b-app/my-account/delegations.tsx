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
import { parseAsString, useQueryState } from "nuqs";

const Delegations = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useMyBAppAccount();
  const { assets } = useAccountAssets();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [, setPercentage] = useQueryState("percentage", parseAsString);
  const [, setDelegateAddress] = useQueryState(
    "delegateAddress",
    parseAsString,
  );
  const [, setDelegatedValue] = useQueryState("delegatedValue", parseAsString);
  const updateDelegatedValue = (
    address: string,
    delegatedValue: number,
    percentage: string,
  ) => {
    setPercentage(percentage);
    setDelegateAddress(address);
    setDelegatedValue(delegatedValue.toString());
    setIsOpenModal(true);
  };

  return (
    <MyAccountWrapper filter={AccountSelect.Delegations}>
      <Container variant="vertical" size="xl">
        <Text variant="body-1-semibold">My Assets</Text>
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
            navigate("/account/my-delegations");
          }}
        />
      )}
    </MyAccountWrapper>
  );
};

export default Delegations;
