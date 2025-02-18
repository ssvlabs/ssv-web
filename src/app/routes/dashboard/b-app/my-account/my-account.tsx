import { useState } from "react";
import { Helmet } from "react-helmet";
import Switcher from "@/components/ui/switcher.tsx";
import { Container } from "@/components/ui/container.tsx";
import Services from "@/app/routes/dashboard/b-app/my-account/services.tsx";
import Delegations from "@/app/routes/dashboard/b-app/my-account/delegations.tsx";
import { useMyBAppAccount } from "@/hooks/b-app/use-my-b-app-account.ts";
import MyStrategies from "@/app/routes/dashboard/b-app/my-account/my-strategies.tsx";

enum AccountSelect {
  Delegations = "Delegations",
  Strategy = "Strategy",
  Services = "Services",
}

const MyAccount = () => {
  const [currentFilter, setCurrentFilter] = useState<AccountSelect>(
    AccountSelect.Delegations,
  );
  const components = {
    [AccountSelect.Delegations]: Delegations,
    [AccountSelect.Strategy]: MyStrategies,
    [AccountSelect.Services]: Services,
  };
  const { myStrategies } = useMyBAppAccount();
  const SWITCH_BUTTONS = [
    {
      label: AccountSelect.Delegations,
      count: 1,
    },
    {
      label: AccountSelect.Strategy,
      count: myStrategies.strategies.length,
    },
  ];
  const Component = components[currentFilter];

  return (
    <>
      <Helmet>
        <title>My Account</title>
      </Helmet>
      <Container variant="vertical" size="xl" className="py-6">
        <Switcher
          onBtnClick={setCurrentFilter as (value: string) => void}
          buttons={SWITCH_BUTTONS.map((btn) => ({
            ...btn,
            isSelected: btn.label === currentFilter,
          }))}
        />
        <Component />
      </Container>
    </>
  );
};

export default MyAccount;
