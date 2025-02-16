import { Wizard } from "@/components/ui/wizard.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "@/components/ui/container.tsx";
import AccountsTable from "@/app/routes/dashboard/b-app/my-account/accounts-table.tsx";
import { useState } from "react";
import Delegate from "@/app/routes/dashboard/b-app/my-account/delegate.tsx";
import { Text } from "@/components/ui/text.tsx";
import { SearchInput } from "@/components/ui/search-input.tsx";

const Accounts = () => {
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const searchByAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("address", e.target.value);
      return params;
    });
  };

  const openDelegate = (address: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("delegateAddress", address);
      return params;
    });
    setIsOpenModal(true);
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
          <AccountsTable onDelegateClick={openDelegate} />
          {isOpenModal && (
            <Delegate closeDelegatePopUp={() => setIsOpenModal(false)} />
          )}
        </Container>
      }
      onClose={() => navigate("/account")}
    />
  );
};

export default Accounts;
