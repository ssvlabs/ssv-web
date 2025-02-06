import { Helmet } from "react-helmet";
import { Container } from "@/components/ui/container.tsx";
// import Switcher from "@/components/ui/switcher.tsx";
import { useState } from "react";
import Delegations from "@/app/routes/dashboard/my-account/delegations.tsx";
import Strategy from "@/app/routes/dashboard/my-account/strategy.tsx";
import Services from "@/app/routes/dashboard/my-account/services.tsx";

enum AccountSelect {
  Delegations = "Delegations",
  Strategy = "Strategy",
  Services = "Services",
}

// const SWITCH_BUTTONS = [
//   {
//     label: AccountSelect.Delegations,
//     count: 1,
//   },
//   {
//     label: AccountSelect.Strategy,
//     count: 0,
//   },
//   {
//     label: AccountSelect.Services,
//     count: 0,
//   },
// ];

const MyAccount = () => {
  const [currentFilter, setCurrentFilter] = useState<AccountSelect>(
    AccountSelect.Delegations,
  );
  const components = {
    [AccountSelect.Delegations]: Delegations,
    [AccountSelect.Strategy]: Strategy,
    [AccountSelect.Services]: Services,
  };
  setCurrentFilter;
  const Component = components[currentFilter];

  return (
    <>
      <Helmet>
        <title>My Account</title>
      </Helmet>
      <Container variant="vertical" size="xl" className="py-6">
        {/*<Switcher*/}
        {/*  onBtnClick={setCurrentFilter as (value: string) => void}*/}
        {/*  buttons={SWITCH_BUTTONS.map((btn) => ({*/}
        {/*    ...btn,*/}
        {/*    isSelected: btn.label === currentFilter,*/}
        {/*  }))}*/}
        {/*/>*/}
        <Component />
      </Container>
    </>
  );
};

export default MyAccount;
