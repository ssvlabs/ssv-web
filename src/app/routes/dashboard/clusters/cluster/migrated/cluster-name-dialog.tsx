import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignMessage } from "wagmi";
import { FaXmark } from "react-icons/fa6";
import { updateClusterName } from "@/api/cluster";
import { queryClient } from "@/lib/react-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const makeSchema = (hasExistingName: boolean) =>
  z.object({
    name: z
      .string()
      .refine(
        (val) =>
          hasExistingName ? val === "" || val.length >= 3 : val.length >= 3,
        "Cluster name must be at least 3 characters",
      )
      .refine(
        (val) => val.length <= 30,
        "Cluster name must be at most 30 characters",
      ),
  });

type ClusterNameDialogProps = {
  clusterId: string;
  currentName?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ClusterNameDialog = ({
  clusterId,
  currentName,
  isOpen,
  onOpenChange,
}: ClusterNameDialogProps) => {
  const form = useForm({
    mode: "onChange",
    values: { name: isOpen ? (currentName ?? "") : "" },
    resolver: zodResolver(makeSchema(!!currentName)),
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { signMessage, isPending: isSigning } = useSignMessage({
    mutation: {
      onSuccess: async (signature) => {
        const name = form.getValues("name") || clusterId;
        setIsUpdating(true);
        setApiError(null);
        try {
          await updateClusterName(clusterId, { name, signature });
          // Poll until the API reflects the new name
          const expectedName = name === clusterId ? undefined : name;
          for (let i = 0; i < 10; i++) {
            await queryClient.refetchQueries({ queryKey: ["cluster"] });
            const data = queryClient.getQueriesData<{ name?: string }>({
              predicate: (query) =>
                query.queryKey[0] === "cluster" &&
                query.queryKey[1] === clusterId.toLowerCase(),
            });
            const current = data[0]?.[1];
            if (
              (expectedName === undefined && !current?.name) ||
              current?.name === expectedName
            ) break;
            await new Promise((r) => setTimeout(r, 1000));
          }
          await queryClient.invalidateQueries({ queryKey: ["paginated-my-account-clusters"] });
          onOpenChange(false);
          form.reset();
        } catch (err) {
          const e = err as { response?: { data?: { message?: { message?: string } | string } } };
          const msg = e?.response?.data?.message;
          const text =
            typeof msg === "string"
              ? msg
              : typeof msg === "object" && msg?.message
                ? msg.message
                : "Failed to update cluster name";
          setApiError(text);
        } finally {
          setIsUpdating(false);
        }
      },
    },
  });

  const isPending = isSigning || isUpdating;

  const handleUpdate = form.handleSubmit(({ name }) => {
    signMessage({ message: name || clusterId });
  });

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) setApiError(null);
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[648px] max-w-[648px] gap-6 p-8">
        <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors">
          <FaXmark className="size-4" />
        </DialogClose>
        <DialogHeader className="gap-3">
          <DialogTitle>Cluster name</DialogTitle>
          <p className="text-sm text-gray-700">
            Set a display name for this cluster
          </p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleUpdate} className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Cluster"
                        {...field}
                        onChange={(e) => {
                          setApiError(null);
                          field.onChange(e);
                        }}
                        disabled={isPending}
                        className={field.value ? "pr-14" : undefined}
                        aria-invalid={
                          (field.value.length > 0 &&
                            !!form.formState.errors.name) ||
                          !!apiError
                        }
                      />
                      {field.value && (
                        <button
                          type="button"
                          onClick={() => form.setValue("name", "", { shouldValidate: true, shouldDirty: true })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </FormControl>
                  {form.formState.dirtyFields.name &&
                    field.value.length > 0 &&
                    !apiError && <FormMessage />}
                  {apiError && (
                    <p className="text-sm text-error-500">{apiError}</p>
                  )}
                </FormItem>
              )}
            />
            {(() => {
              const value = form.watch("name");
              const isRemove = !!currentName && value === "";
              return (
                <Button
                  type="submit"
                  size="xl"
                  variant={isRemove ? "secondary" : "default"}
                  disabled={
                    !form.formState.isDirty ||
                    !form.formState.isValid ||
                    isPending
                  }
                  isLoading={isPending}
                >
                  {isRemove ? "Remove Name" : "Update Details"}
                </Button>
              );
            })()}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

ClusterNameDialog.displayName = "ClusterNameDialog";
