import { Container } from "@/components/ui/container.tsx";
import { Text } from "@/components/ui/text.tsx";
import { SearchInput } from "@/components/ui/search-input.tsx";
import { BAppsTable } from "@/components/based-apps/b-app-table/b-apps-table.tsx";
import { useBApps } from "@/hooks/b-app/use-b-apps.ts";
import { Wizard } from "@/components/ui/wizard.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CreateSteps,
  STEPS_LABELS,
} from "@/app/routes/dashboard/b-app/strategies/create.tsx";

const BApps = () => {
  const { bApps, pagination, isBAppsLoading } = useBApps();
  const navigate = useNavigate();

  const [, setSearchParams] = useSearchParams();

  const searchById = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("id", e.target.value);
      return params;
    });
  };

  return (
    <Wizard
      onNext={() => navigate("../obligations")}
      title={"Create Strategy"}
      steps={Object.values(STEPS_LABELS)}
      children={
        <Container variant="vertical" size="xl" className="py-6">
          <div className="flex justify-between w-full items-center">
            <Text variant="body-1-semibold">Select bApp</Text>
            <div className="flex items-center gap-2">
              <SearchInput
                onChange={searchById}
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
          <BAppsTable
            isCreateFlow
            isLoading={isBAppsLoading}
            bApps={bApps}
            pagination={pagination}
          />
        </Container>
      }
      currentStepNumber={CreateSteps.SelectBApp}
      skipToStep={() => navigate("../fee")}
      onClose={() => {
        navigate(-1);
      }}
    />
  );
};

export default BApps;
