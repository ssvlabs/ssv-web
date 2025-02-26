import { BAppsTable } from "@/components/based-apps/b-app-table/b-apps-table.tsx";
import { Container } from "@/components/ui/container.tsx";
import { Input } from "@/components/ui/input.tsx";
import ObligationsTable from "@/components/based-apps/obligations-table/obligations-table.tsx";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import type { BApp } from "@/api/b-app.ts";
import { useNavigate } from "react-router-dom";
import { Wizard } from "@/components/ui/wizard.tsx";
import { CreateSteps, STEPS_LABELS } from "@/types/b-app.ts";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  registerData: z
    .string()
    .regex(
      /^0x[a-fA-F0-9]*$|^$/,
      "Hash must start with 0x and contain only hexadecimal characters, or be empty",
    ),
});

const Obligations = () => {
  const navigate = useNavigate();
  const form = useForm({
    mode: "all",
    defaultValues: { registerData: "" },
    resolver: zodResolver(schema),
  });
  return (
    <Wizard
      onNext={() => navigate("../fee")}
      isNextDisabled={!!form.formState.errors["registerData"]}
      title={"Create Strategy"}
      steps={Object.values(STEPS_LABELS)}
      children={
        <Container variant="vertical" size="xl" className="py-6">
          <BAppsTable bApps={[useCreateStrategyContext().bApp as BApp]} />
          <Form {...form}>
            <FormField
              control={form.control}
              name="registerData"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="size-full px-6 py-4 rounded-[16px] bg-white">
                      <Input
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        saveButtonAction={() => {
                          useCreateStrategyContext.state.registerData =
                            field.value as `0x${string}`;
                        }}
                        editButtonAction={() => {
                          useCreateStrategyContext.state.registerData =
                            "" as `0x${string}`;
                        }}
                        isSaveButtonDisabled={
                          !!form.formState.errors["registerData"]
                        }
                        withDisableButton
                        className="h-10"
                      />
                      <FormMessage />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <ObligationsTable
              obligations={useCreateStrategyContext().bApp.supportedAssets}
            />
          </Form>
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
