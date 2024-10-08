import type { OperatorMetadata } from "@/api/operator";
import { toast } from "@/components/ui/use-toast";
import { useSetOperatorMetadata } from "@/hooks/operator/use-set-operator-metadata";
import { invalidateOperatorQuery } from "@/hooks/operator/use-operator";
import { useSignMessage } from "wagmi";

export const useSignOperatorMetadata = () => {
  const sign = useSignMessage();
  const setOperatorMetadata = useSetOperatorMetadata();

  const submit = async (
    operatorId: string,
    data: {
      message: string;
      metadata: Omit<OperatorMetadata, "signature">;
    },
  ) => {
    const signature = await sign.signMessageAsync({
      message: data.message,
    });

    return setOperatorMetadata
      .mutateAsync({
        operatorId,
        metadata: {
          ...data.metadata,
          signature,
        },
      })
      .then(() => {
        invalidateOperatorQuery(operatorId).then(() => {
          toast({
            title: "Metadata updated",
            description: "The operator metadata has been updated.",
          });
        });
      });
  };
  return { submit, isPending: setOperatorMetadata.isPending || sign.isPending };
};
