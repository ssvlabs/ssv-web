import { zodResolver } from "@hookform/resolvers/zod";
import { Collapse } from "react-collapse";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { Container } from "@/components/ui/container";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BigNumberInput } from "@/components/ui/number-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tw";
import { Spacer } from "@/components/ui/spacer";
import type { Operator } from "@/types/api";

type SwitchWizardStepTwoProps = {
  onNext: () => void;
  onBack?: () => void;
  backButtonLabel?: string;
  navigateRoutePath?: string;
  operators?: Pick<Operator, "id" | "name" | "logo" | "fee">[];
  validatorsAmount?: number;
};

const schema = z.object({
  selected: z.enum(["current-balance", "year", "custom"]),
  custom: z.coerce.number().positive().min(1),
});

export const SwitchWizardStepTwo = ({
  onNext,
  onBack,
  backButtonLabel = "Back",
  navigateRoutePath,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  operators: _operators = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validatorsAmount: _validatorsAmount = 1,
}: SwitchWizardStepTwoProps) => {
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      custom: 182,
      selected: "current-balance",
    },
    resolver: zodResolver(schema),
  });

  const values = form.watch();

  const submit = form.handleSubmit(() => {
    // TODO: Handle form submission
    onNext();
  });

  return (
    <Container
      variant="vertical"
      className="py-6"
      backButtonLabel={backButtonLabel}
      navigateRoutePath={navigateRoutePath}
      onBackButtonClick={onBack}
    >
      <Form {...form}>
        <Card
          as="form"
          onSubmit={submit}
          variant="unstyled"
          className="w-full flex flex-col gap-5 p-8 bg-white rounded-2xl"
        >
          <div className="flex flex-col gap-4 items-start">
            <Text variant="headline4">
              Select your validator funding period
            </Text>
            <Text variant="body-2-medium" className="text-gray-700">
              The ETH amount you deposit will determine your validator
              operational runway (You can always manage it later by withdrawing
              or depositing more funds).
            </Text>
          </div>

          <FormField
            control={form.control}
            name="selected"
            render={({ field }) => (
              <FormItem>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-col gap-2 [&>*]:w-full"
                >
                  <FormLabel htmlFor="current-balance">
                    <div className="flex items-center gap-3 border border-gray-400 rounded-lg py-[18px] px-6 outline outline-[4px] outline-none outline-offset-0 has-[input:checked]:border-primary-500 has-[input:checked]:outline-primary-100">
                      <RadioGroupItem
                        value="current-balance"
                        id="current-balance"
                      />
                      <Text variant="body-2-semibold">Use Current Balance</Text>
                      <Text variant="body-3-medium" className="text-gray-500">
                        (~40 Days)
                      </Text>
                      <Spacer />
                      <div className="flex flex-col items-end">
                        <Text variant="body-1-bold">0 ETH</Text>
                        <Text variant="body-3-medium" className="text-gray-500">
                          $0.0
                        </Text>
                      </div>
                    </div>
                  </FormLabel>

                  <FormLabel htmlFor="year">
                    <div className="flex items-center gap-3 border border-gray-400 rounded-lg py-[18px] px-6 outline outline-[4px] outline-none outline-offset-0 has-[input:checked]:border-primary-500 has-[input:checked]:outline-primary-100">
                      <RadioGroupItem value="year" id="year" />
                      <Text variant="body-2-semibold">1 Year</Text>
                      <Spacer />
                      <div className="flex flex-col items-end">
                        <Text variant="body-1-bold">3.642 ETH</Text>
                        <Text variant="body-3-medium" className="text-gray-500">
                          ~$10,611.03
                        </Text>
                      </div>
                    </div>
                  </FormLabel>

                  <FormLabel htmlFor="custom">
                    <div className="border border-gray-400 rounded-lg py-[18px] px-6 outline outline-[4px] outline-none outline-offset-0 has-[input:checked]:border-primary-500 has-[input:checked]:outline-primary-100">
                      <div className="flex gap-3 items-center">
                        <RadioGroupItem value="custom" id="custom" />
                        <Text variant="body-2-semibold">Custom Period</Text>
                        <Spacer />
                        <div className="flex flex-col items-end">
                          <Text variant="body-1-bold">
                            {values.selected === "custom" ? "7.2812 ETH" : "-"}
                          </Text>
                          <Text
                            variant="body-3-medium"
                            className="text-gray-500"
                          >
                            {values.selected === "custom" ? "~$21,150.32" : ""}
                          </Text>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "transition-all duration-100",
                          values.selected === "custom" ? "mt-4" : "mt-0",
                        )}
                      >
                        <Collapse isOpened={values.selected === "custom"}>
                          <FormField
                            control={form.control}
                            name="custom"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <BigNumberInput
                                    className="text-gray-800 border border-gray-400 rounded-lg px-4 py-2"
                                    value={BigInt(field.value)}
                                    onChange={(value) =>
                                      field.onChange(Number(value))
                                    }
                                    decimals={0}
                                    max={BigInt(365 * 9999)}
                                    displayDecimals={0}
                                    rightSlot={<>Days</>}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </Collapse>
                      </div>
                    </div>
                  </FormLabel>
                </RadioGroup>
              </FormItem>
            )}
          />

          {/* Funding Summary - placeholder ETH values */}
          <div className="flex flex-col gap-2">
            <div
              className="grid gap-2 gap-x-8"
              style={{ gridTemplateColumns: "1fr auto auto auto" }}
            >
              <Text variant="body-3-semibold" className="text-gray-500">
                Funding Summary
              </Text>
              <Text
                variant="body-3-semibold"
                className="text-gray-500 text-right"
              >
                Fee (182 Days)
              </Text>
              <Text
                variant="body-3-semibold"
                className="text-gray-500 text-right"
              >
                Effective Balance
              </Text>
              <Text
                variant="body-3-semibold"
                className="text-gray-500 text-right"
              >
                Subtotal
              </Text>

              <Text variant="body-2-medium">Operators fee</Text>
              <Text variant="body-2-medium" className="text-right">
                0.0416 ETH
              </Text>
              <Text variant="body-2-medium" className="text-right">
                32 ETH
              </Text>
              <Text variant="body-2-medium" className="text-right">
                1.3312 ETH
              </Text>

              <Text variant="body-2-medium">Network fee</Text>
              <Text variant="body-2-medium" className="text-right">
                0.0203 ETH
              </Text>
              <Text variant="body-2-medium" className="text-right">
                32 ETH
              </Text>
              <Text variant="body-2-medium" className="text-right">
                0.6496 ETH
              </Text>

              <div className="flex gap-2 items-center">
                <Text variant="body-2-medium">Liquidation collateral</Text>
                {/* Info icon placeholder */}
              </div>
              <Text variant="body-2-medium" className="text-right">
                0.0015 ETH
              </Text>
              <Text variant="body-2-medium" className="text-right">
                32 ETH
              </Text>
              <Text variant="body-2-medium" className="text-right">
                0.0048 ETH
              </Text>
            </div>

            <div className="border-t border-gray-300 my-2" />

            <div className="flex items-start justify-between">
              <Text variant="body-2-medium">Total</Text>
              <div className="flex flex-col items-end">
                <Text variant="headline4">14.6625 ETH</Text>
                <Text variant="body-3-medium" className="text-gray-500">
                  ~$46,468.65
                </Text>
              </div>
            </div>
          </div>

          <Button
            size="xl"
            width="full"
            type="submit"
            className="font-semibold"
          >
            Next
          </Button>
        </Card>
      </Form>
    </Container>
  );
};
