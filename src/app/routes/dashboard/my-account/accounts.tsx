import { Wizard } from "@/components/ui/wizard.tsx";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container.tsx";
import AccountsTable from "@/app/routes/dashboard/my-account/accounts-table.tsx";

const Accounts = () => {
  const navigate = useNavigate();
  return (
    <Wizard
      title={"Delegate Validator Balance"}
      children={
        <Container variant="vertical" size="xl" className="py-6">
          <AccountsTable />
        </Container>
      }
      isOpen={true}
      onClose={() => navigate("/account")}
    />
  );
};

export default Accounts;
