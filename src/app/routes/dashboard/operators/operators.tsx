import { DashboardPicker } from "@/components/dashboard/dashboard-picker";
import { OperatorsTable } from "@/components/operator/operators-table/operators-table";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { usePaginatedAccountOperators } from "@/hooks/operator/use-paginated-account-operators";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export const Operators: FC<ComponentPropsWithoutRef<"div">> = () => {
  const accountOperators = usePaginatedAccountOperators();
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>SSV My Operators</title>
      </Helmet>

      <Container variant="vertical" size="xl" className="py-6">
        <div className="flex justify-between w-full gap-3">
          <DashboardPicker />
          <Button size="lg" as={Link} className="px-10" to="/join/operator">
            Add Operator
          </Button>
        </div>
        <OperatorsTable
          operators={accountOperators.operators}
          pagination={accountOperators.pagination}
          onOperatorClick={(operator) => {
            navigate(operator.id.toString());
          }}
        />
      </Container>
    </>
  );
};

Operators.displayName = "Operators";
