import { useQuery } from "@tanstack/react-query";
import { toChecksumAddress } from "ssv-keys/dist/tsc/src/lib/helpers/web3.helper";
import { useAccount } from "@/hooks/account/use-account.ts";
import { getAllValidators } from "@/api/validators.ts";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params.ts";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";
import type { Address } from "abitype";

export type Proof = {
  proof: {
    encrypted_share: string;
    owner: string;
    share_pub: string;
    validator: string;
  };
  signature: string;
};

type ProofsValidatorsType = { publicKey: string; proofs: Proof[] };

type ValidateProofsResult = {
  proofs: Proof[];
  validators: ProofsValidatorsType[];
};

const validateProofs = (proofs: Proof[] | Proof[][], address: Address) =>
  proofs.every((proof: Proof | Proof[]) =>
    Array.isArray(proof)
      ? proof.every(
          (p: Proof) =>
            toChecksumAddress(`0x${p.proof.owner}`) === address &&
            p.proof.validator === proof[0].proof.validator,
        )
      : toChecksumAddress(`0x${proof.proof.owner}`) === address &&
        proof.proof.validator === (proofs as Proof[])[0].proof.validator,
  );

export const useValidateProofs = (files: File[]) => {
  const account = useAccount();
  const { state } = useBulkActionContext;
  const { clusterHash } = useClusterPageParams();

  const readFileAsText = async (file: File): Promise<string> => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsText(file);
    });
  };

  return useQuery<ValidateProofsResult, Error>({
    queryKey: [files.length, files.map((file) => file.name).join("-")],
    retry: false,
    enabled: files.length > 0,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      if (files.length === 0) {
        throw new Error("No file uploaded.");
      }

      const file = files[0];

      if (!file || file.type !== "application/json") {
        throw new Error("Please upload a valid JSON file.");
      }

      if (!account.address) {
        throw new Error("Should be connected.");
      }

      try {
        const fileContent = await readFileAsText(file);
        const json = JSON.parse(fileContent);
        const isValid = validateProofs(json, account.address);
        if (!isValid) {
          throw new Error("Wrong proofs file.");
        }
        const allRegisteredValidators = await getAllValidators(
          clusterHash || "",
        );

        const validators: ProofsValidatorsType[] = Array.from(
          new Set(
            json.reduce(
              (acc: ProofsValidatorsType[], proof: Proof | Proof[]) => {
                const validatorPublicKey = `0x${Array.isArray(proof) ? proof[0].proof.validator : proof.proof.validator}`;
                if (
                  !allRegisteredValidators.data.includes(validatorPublicKey)
                ) {
                  if (!Array.isArray(proof)) {
                    throw new Error("No registered public keys found.");
                  }
                  return acc;
                }
                if (Array.isArray(proof)) {
                  acc.push({
                    publicKey: validatorPublicKey,
                    proofs: proof,
                  });
                } else {
                  if (!acc[0]) {
                    acc[0] = {
                      publicKey: validatorPublicKey,
                    } as ProofsValidatorsType;
                  }
                  acc[0].proofs = [...(acc[0].proofs || []), proof];
                }
                return acc;
              },
              [],
            ),
          ),
        );
        state.dkgReshareState.selectedValidatorsCount = validators.length;

        return {
          proofs: json,
          validators,
        };
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new Error(
            "Invalid file content. Please upload a valid proofs.json file.",
          );
        }
        throw error;
      }
    },
  });
};
