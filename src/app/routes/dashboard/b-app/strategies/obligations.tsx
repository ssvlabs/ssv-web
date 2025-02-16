import { BAppsTable } from "@/components/based-apps/b-app-table/b-apps-table.tsx";
import { Container } from "@/components/ui/container.tsx";
import { Input } from "@/components/ui/input.tsx";
import ObligationsTable from "@/components/based-apps/obligations-table/obligations-table.tsx";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import type { BApp } from "@/api/b-app.ts";
import { useNavigate } from "react-router-dom";
import { Wizard } from "@/components/ui/wizard.tsx";
import {
  CreateSteps,
  STEPS_LABELS,
} from "@/app/routes/dashboard/b-app/strategies/create.tsx";

const Obligations = () => {
  const navigate = useNavigate();
  return (
    <Wizard
      onNext={() => navigate("../fee")}
      title={"Create Strategy"}
      steps={Object.values(STEPS_LABELS)}
      children={
        <Container variant="vertical" size="xl" className="py-6">
          <BAppsTable bApps={[useCreateStrategyContext().bApp as BApp]} />
          <div className="size-full px-6 py-4 rounded-[16px] bg-white">
            <Input className="h-10" />
          </div>
          <ObligationsTable
            obligations={useCreateStrategyContext().bApp.supportedAssets}
          />
        </Container>
      }
      currentStepNumber={CreateSteps.SetObligations}
      onClose={() => {
        navigate(-1);
      }}
    />
  );
};

export default Obligations;
