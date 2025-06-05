import { BAppsTable } from "@/components/based-apps/b-app-table/b-apps-table.tsx";
import { Container } from "@/components/ui/container.tsx";
import ObligationsTable from "@/components/based-apps/obligations-table/obligations-table.tsx";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import type { BApp, BAppsMetaData } from "@/api/b-app.ts";
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
import type { Hex } from "viem";
import { isHex } from "viem";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Span, Text, textVariants } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/tw";
import { Tooltip } from "@/components/ui/tooltip";
import { useKeyPressEvent } from "react-use";

const schema = z.object({
  registerData: z.string().refine((val) => {
    if (!val) return true;
    return isHex(val);
  }, "Hash must start with 0x and contain only hexadecimal characters, or be empty"),
});

const Obligations = ({
  isNotWizard,
  isObligationManage,
}: {
  isNotWizard?: boolean;
  isObligationManage?: boolean;
}) => {
  const navigate = useNavigate();
  const context = useCreateStrategyContext();
  const form = useForm({
    mode: "all",
    defaultValues: { registerData: context.registerData || "" },
    resolver: zodResolver(schema),
  });

  const [isEditing, setIsEditing] = useState(false);

  const submit = form.handleSubmit(({ registerData }) => {
    useCreateStrategyContext.state.registerData = registerData as Hex;
    setIsEditing(false);
  });

  const cancel = () => {
    form.reset({ registerData: context.registerData || "" });
    setIsEditing(false);
  };

  useKeyPressEvent("Escape", (ev) => {
    ev.preventDefault();
    cancel();
  });

  return (
    <Wizard
      isNotWizard={isNotWizard}
      onNext={() => navigate("../fee")}
      isNextDisabled={!!form.formState.errors["registerData"]}
      title={"Create Strategy"}
      steps={Object.values(STEPS_LABELS)}
      children={
        <Container variant="vertical" size="xl" className="py-6">
          <BAppsTable
            isClickable={false}
            bApps={[useCreateStrategyContext().bApp as BApp & BAppsMetaData]}
          />
          <Form {...form}>
            <Card as="form" className="w-full px-6 py-4" onSubmit={submit}>
              <FormField
                control={form.control}
                name="registerData"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      {!field.value && !isEditing ? (
                        <Tooltip
                          asChild
                          hasArrow
                          content={
                            <Text>
                              Optional field for off-chain information required
                              by some bApps for participation. Please check this
                              bApp’s documentation before opting-in.{" "}
                              <Span
                                as="a"
                                href="https://docs.ssv.network/based-applications/developers/get-started/#4-opting-in"
                                className={buttonVariants({ variant: "link" })}
                                target="_blank"
                              >
                                Read more.
                              </Span>
                            </Text>
                          }
                        >
                          <Button
                            onClick={() => setIsEditing(true)}
                            variant="outline"
                            className="flex w-full items-center justify-center h-10 rounded-md bg-gray-100 border border-gray-300 text-primary-500 cursor-pointer"
                          >
                            <Text
                              variant="body-3-medium"
                              className="text-primary-500"
                            >
                              Add Data
                            </Text>
                          </Button>
                        </Tooltip>
                      ) : (
                        <Input
                          {...field}
                          autoFocus
                          className="h-10 w-full  pr-1 bg-gray-100"
                          inputProps={{
                            className: textVariants({
                              variant: "body-3-medium",
                              className: cn("text-gray-900", {
                                "text-gray-600": !isEditing,
                              }),
                            }),
                          }}
                          disabled={!isEditing}
                          placeholder="0x...."
                          rightSlot={
                            isEditing ? (
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="h-8 rounded-[5px]"
                                  onClick={cancel}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  className="h-8 rounded-[5px]"
                                  disabled={
                                    !!form.formState.errors["registerData"]
                                  }
                                >
                                  <Text>Save</Text>
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                type="button"
                                className="h-8 rounded-[5px]"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  return setIsEditing(true);
                                }}
                              >
                                <Text
                                  variant="body-3-medium"
                                  className="text-primary-500"
                                >
                                  Edit Data
                                </Text>
                              </Button>
                            )
                          }
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
            <ObligationsTable
              isObligationManage={isObligationManage}
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
