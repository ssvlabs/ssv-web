import { useMetadataEditor } from "@/app/routes/dashboard/b-app/strategies/metadata-editor/use-metadat-editor";
import { Button, IconButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Text, textVariants } from "@/components/ui/text";
import { useStrategy } from "@/hooks/b-app/use-strategy";
import { useUpdateAccountMetadataURI } from "@/lib/contract-interactions/b-app/write/use-update-account-metadata-uri";
import { useUpdateStrategyMetadataURI } from "@/lib/contract-interactions/b-app/write/use-update-strategy-metadata-uri";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useBatchTransactionMachine } from "@/lib/machines/batch-transactions/context";
import { useMetadataEditorModal } from "@/signals/modal";
import { X } from "lucide-react";
import { useEffect, type FC } from "react";

export type MetadataEditorModalProps = {
  // TODO: Add props or remove this type
};

export const MetadataEditorModal: FC<MetadataEditorModalProps> = () => {
  const modal = useMetadataEditorModal();
  const strategy = useStrategy(modal.meta.strategyId);
  const [batchMachineState, batchMachineSend] = useBatchTransactionMachine();

  const { form, fetchAccountsMetadata, fetchStrategiesMetadata } =
    useMetadataEditor({
      strategyId: modal.meta.strategyId || "",
      defaultValues: {
        accountMetadataURI: strategy.account.metadataURI || "",
        strategyMetadataURI: strategy.strategy.metadataURI || "",
      },
    });

  useEffect(() => {
    if (!modal.isOpen) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal.isOpen, form.reset]);

  const updateAccountMetadataURI = useUpdateAccountMetadataURI();
  const updateStrategyMetadataURI = useUpdateStrategyMetadataURI();

  const isWriting =
    updateAccountMetadataURI.isPending ||
    updateStrategyMetadataURI.isPending ||
    batchMachineState.matches("write");

  const submit = form.handleSubmit((data) => {
    const hasStrategyURIChanged =
      data.strategyMetadataURI !== strategy.strategy.metadataURI;
    const hasAccountURIChanged =
      data.accountMetadataURI !== strategy.account.metadataURI;

    const didStrategyAndAccountURIChange =
      hasStrategyURIChanged && hasAccountURIChanged;

    const onDone = () => {
      strategy.invalidate();
      modal.close();
      form.reset();
    };

    const options = withTransactionModal({ onMined: onDone });

    if (didStrategyAndAccountURIChange)
      return batchMachineSend({
        type: "write",
        header: "Edit Metadata",
        writers: [
          {
            name: "Update Strategy",
            write: () =>
              updateStrategyMetadataURI.send({
                strategyId: +strategy.strategy.id,
                metadataURI: data.strategyMetadataURI,
              }),
          },
          {
            name: "Update Account",
            write: () =>
              updateAccountMetadataURI.send({
                metadataURI: data.accountMetadataURI,
              }),
          },
        ],
        onDone,
      });

    if (hasStrategyURIChanged)
      return updateStrategyMetadataURI.write(
        {
          strategyId: +strategy.strategy.id,
          metadataURI: data.strategyMetadataURI,
        },
        options,
      );

    if (hasAccountURIChanged)
      return updateAccountMetadataURI.write(
        {
          metadataURI: data.accountMetadataURI,
        },
        options,
      );
  });

  return (
    <Dialog {...modal}>
      <DialogContent
        asChild
        className="max-w-[1520px] max-h-[90%] bg-gray-100 p-0 overflow-y-auto "
      >
        <form onSubmit={submit}>
          <IconButton
            variant="ghost"
            onClick={() => modal.close()}
            className="text-gray-900 flex items-center justify-center right-0 top-0 m-4 absolute"
          >
            <X className="text-gray-900 size-4" />
          </IconButton>
          <div className="flex flex-col gap-8 p-6">
            <DialogHeader>
              <DialogTitle
                className={textVariants({
                  variant: "body-1-bold",
                  className: "text-gray-900",
                })}
              >
                Edit Metadata
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-5">
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="strategyMetadataURI"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="flex flex-col bg-white gap-6 w-full rounded-[16px] p-6">
                          <div className="flex flex-col gap-3">
                            <Text variant="body-1-bold">Strategy</Text>
                            <Text variant="body-3-medium">
                              Provide the metadata URI for your strategy.
                            </Text>
                          </div>
                          <div className="flex flex-col gap-3">
                            <Input
                              isLoading={fetchStrategiesMetadata.isPending}
                              {...field}
                              placeholder="Enter URI String..."
                            />
                            <div className="px-6 py-4 rounded-[12px] bg-gray-100 flex items-center gap-3">
                              <Text
                                className={`${form.formState.errors["strategyMetadataURI"] ? "text-error-500" : "text-gray-500"}`}
                                variant="body-3-medium"
                              >
                                {form.formState.errors["strategyMetadataURI"]
                                  ?.message ||
                                  (fetchStrategiesMetadata.isSuccess &&
                                  fetchStrategiesMetadata?.data.list[0]?.data
                                    ? fetchStrategiesMetadata?.data.list[0]
                                        ?.data?.name || 'Missing "name"'
                                    : "Strategy name")}
                              </Text>
                            </div>
                            <div className="px-6 py-4 rounded-[12px] bg-gray-100 flex items-center gap-3">
                              <Text
                                className="text-gray-500"
                                variant="body-3-medium"
                              >
                                {fetchStrategiesMetadata.isSuccess &&
                                fetchStrategiesMetadata.data &&
                                fetchStrategiesMetadata.data.list[0]?.data
                                  ? fetchStrategiesMetadata.data.list[0]?.data
                                      .description || 'Missing "description"'
                                  : "Description"}
                              </Text>
                            </div>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountMetadataURI"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="flex flex-col bg-white gap-6 w-full rounded-[16px] p-6">
                          <div className="flex flex-col gap-3">
                            <Text
                              className="flex items-center gap-1"
                              variant="body-1-bold"
                            >
                              Account{" "}
                              <Text
                                className="text-gray-500"
                                variant="body-3-medium"
                              >
                                (optional)
                              </Text>
                            </Text>
                            <Text variant="body-3-medium">
                              Provide the metadata URI for your account.
                            </Text>
                            <Text variant="body-3-medium">
                              These details will show up next to each strategy
                              created by this account.
                            </Text>
                          </div>
                          <div className="flex flex-col gap-3">
                            <Input
                              isLoading={fetchAccountsMetadata.isPending}
                              {...field}
                              placeholder="Enter URI String..."
                            />
                            <div className="px-6 py-4 rounded-[12px] bg-gray-100 flex items-center gap-3">
                              <img
                                className="rounded-[8px] size-10 border-gray-400 border"
                                src={
                                  form.formState.errors["accountMetadataURI"]
                                    ? "/images/no-logo.svg"
                                    : fetchAccountsMetadata.isSuccess &&
                                        fetchAccountsMetadata?.data.list[0]
                                          ?.data
                                      ? fetchAccountsMetadata?.data.list[0]
                                          ?.data?.logo ||
                                        "/images/missing-logo.svg"
                                      : "/images/operator_default_background/light.svg"
                                }
                              />
                              <Text
                                className={`${form.formState.errors["accountMetadataURI"] ? "text-error-500" : "text-gray-500"}`}
                                variant="body-3-medium"
                              >
                                {form.formState.errors["accountMetadataURI"]
                                  ?.message ||
                                  (fetchAccountsMetadata.data &&
                                  fetchAccountsMetadata.data.list[0]?.data
                                    ? fetchAccountsMetadata.data.list[0]?.data
                                        .name || 'Missing "name"'
                                    : "Account Name")}
                              </Text>
                            </div>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </Form>
            </div>
          </div>
          <div className="border-t border-gray-300 h-[80px] flex px-6 flex-row items-center justify-between">
            <Button
              size="lg"
              type="button"
              className="w-[160px]"
              variant="secondary"
              onClick={() => modal.close()}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              type="submit"
              className="w-[160px]"
              isLoading={isWriting}
              disabled={!form.formState.isDirty || !form.formState.isValid}
            >
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

MetadataEditorModal.displayName = "MetadataEditorModal";
