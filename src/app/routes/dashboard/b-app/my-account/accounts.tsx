import { Wizard } from "@/components/ui/wizard.tsx";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container.tsx";
import { useState } from "react";
import Delegate from "@/app/routes/dashboard/b-app/my-account/delegate.tsx";
import { Text } from "@/components/ui/text.tsx";
import { SearchInput } from "@/components/ui/search-input.tsx";
import { AccountsTable } from "@/components/based-apps/accounts-table/accounts-table.tsx";
import { useBAppAccounts } from "@/hooks/b-app/use-b-app-accounts.ts";
import { parseAsString, useQueryState } from "nuqs";
import { useMyBAppAccount } from "@/hooks/b-app/use-my-b-app-account.ts";
import { formatGwei } from "viem";
import { useDelegateContext } from "@/components/context/delegate-context.tsx";
import type { AccountMetadata } from "@/api/b-app.ts";

const Accounts = () => {
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { data } = useMyBAppAccount();
  const pathname = useLocation().pathname;
  const [, setAddress] = useQueryState("address", parseAsString);
  const searchByAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.currentTarget.value);
  };
  const { accounts, pagination, isLoading } = useBAppAccounts();
  const { setDelegationData, percentage, delegatedValue } =
    useDelegateContext();

  const openDelegate = (
    address: string,
    delegatedValue?: string,
    percentage?: string,
    metadata?: AccountMetadata,
  ) => {
    setIsOpenModal(true);
    if (setDelegationData && metadata) {
      setDelegationData({
        ...metadata,
        percentage,
        delegateAddress: address,
        delegatedValue: delegatedValue,
      });
    }
  };

  return (
    <Wizard
      title={"Delegate Validator Balance"}
      children={
        <Container variant="vertical" size="xl" className="py-6">
          <div className="flex justify-between w-full items-center">
            <Text variant="body-1-semibold">Select Account</Text>
            <div className="flex items-center gap-2">
              <SearchInput
                onChange={searchByAddress}
                placeholder="Search"
                iconPlacement="left"
                className="h-10 rounded-xl bg-gray-50 text-sm w-[536px] max-w-full"
                inputProps={{
                  className: "bg-gray-50",
                  placeholder: "Search Account...",
                }}
              />
            </div>
          </div>
          <AccountsTable
            effectiveBalance={Number(formatGwei(data?.effectiveBalance || 0n))}
            accountDelegations={data?.delegations}
            pagination={pagination}
            isLoading={isLoading}
            onDelegateClick={openDelegate}
            accounts={accounts}
          />
          {isOpenModal && (
            <Delegate
              isUpdateFlow={!!(percentage && delegatedValue)}
              closeDelegatePopUp={() => setIsOpenModal(false)}
            />
          )}
        </Container>
      }
      onClose={() =>
        navigate(
          matchPath("/account/assets/accounts", pathname)
            ? "/account/assets"
            : "/account/my-delegations",
        )
      }
    />
  );
};

export default Accounts;
