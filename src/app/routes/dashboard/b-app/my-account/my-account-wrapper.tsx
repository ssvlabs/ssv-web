import { Helmet } from "react-helmet";
import Switcher from "@/components/ui/switcher.tsx";
import { Container } from "@/components/ui/container.tsx";
import { useMyBAppAccount } from "@/hooks/b-app/use-my-b-app-account.ts";
import { useNavigate } from "react-router-dom";

export enum AccountSelect {
  Delegations = "my-delegations",
  Strategy = "my-strategies",
  BApps = "my-bApps",
}

const BUTTON_LABELS = {
  [AccountSelect.Delegations]: "Delegations",
  [AccountSelect.Strategy]: "Strategy",
  [AccountSelect.BApps]: "bApps",
};

const MyAccountWrapper = ({
  children,
  filter,
}: {
  children: React.ReactNode;
  filter: AccountSelect;
}) => {
  const navigate = useNavigate();
  const { myStrategies, myBApps } = useMyBAppAccount();
  const SWITCH_BUTTONS = [
    {
      type: AccountSelect.Delegations,
      label: BUTTON_LABELS[AccountSelect.Delegations],
      count: 1,
    },
    {
      type: AccountSelect.Strategy,
      label: BUTTON_LABELS[AccountSelect.Strategy],
      count: myStrategies?.strategies?.length || 0,
    },
    {
      type: AccountSelect.BApps,
      label: BUTTON_LABELS[AccountSelect.BApps],
      count: myBApps?.pagination?.total || 0,
    },
  ];

  const handleChangeFilter = (filter: AccountSelect) => {
    navigate(`/account/${filter}`);
  };

  return (
    <>
      <Helmet>
        <title>My Account</title>
      </Helmet>
      <Container variant="vertical" size="xl" className="py-6">
        <Switcher
          onBtnClick={handleChangeFilter as (value: string) => void}
          buttons={SWITCH_BUTTONS.filter((btn) => Boolean(btn.count)).map(
            (btn) => ({
              ...btn,
              isSelected: btn.type === filter,
            }),
          )}
        />
        {children}
      </Container>
    </>
  );
};

export default MyAccountWrapper;
