import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignMessage } from "wagmi";
import { FaXmark } from "react-icons/fa6";
import { updateClusterMetadata } from "@/api/cluster";
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
    defaultValues: { name: currentName ?? "" },
    resolver: zodResolver(makeSchema(!!currentName)),
  });

  const { signMessage, isPending } = useSignMessage({
    mutation: {
      onSuccess: (signature) => {
        const name = form.getValues("name") || clusterId;
        updateClusterMetadata(clusterId, { name, signature });
        onOpenChange(false);
        form.reset();
      },
    },
  });

  const handleUpdate = form.handleSubmit(({ name }) => {
    signMessage({ message: name || clusterId });
  });

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (open) form.reset({ name: currentName ?? "" });
    else form.reset();
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
                        disabled={isPending}
                        aria-invalid={
                          field.value.length > 0 &&
                          !!form.formState.errors.name
                        }
                      />
                      {field.value && (
                        <button
                          type="button"
                          onClick={() => field.onChange("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </FormControl>
                  {form.formState.dirtyFields.name &&
                    field.value.length > 0 && <FormMessage />}
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="xl"
              disabled={
                !form.formState.isDirty ||
                !form.formState.isValid ||
                isPending
              }
              isLoading={isPending}
            >
              Update Details
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

ClusterNameDialog.displayName = "ClusterNameDialog";
