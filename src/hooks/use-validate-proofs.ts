import { useQuery } from "@tanstack/react-query";

export type Proof = {
  proof: {
    encrypted_share: string;
    owner: string;
    share_pub: string;
    validator: string;
  };
  signature: string;
};

type ValidateProofsResult = {
  proofs: Proof[];
  validators: { publicKey: string; proofs: Proof[] }[];
};

export const useValidateProofs = (files: File[]) => {
  return useQuery<ValidateProofsResult, Error>({
    queryKey: [files],
    retry: false,
    enabled: files.length > 0,
    queryFn: () => {
      const file = files?.[0];
      if (file && file.type === "application/json") {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
              const json = JSON.parse(text);
              const publicKeys: string[] = Array.from(
                new Set(json.map((proof: Proof) => proof.proof.validator)),
              );
              resolve({
                proofs: json,
                validators: publicKeys.map((publicKey: string) => ({
                  publicKey: `0x${publicKey}`,
                  proofs: json.filter(
                    (proof: Proof) => proof.proof.validator === publicKey,
                  ),
                })),
              });
            } catch (error) {
              reject(
                new Error(
                  "The file you uploaded is incorrect, please upload proofs.json",
                ),
              );
            }
          };
          reader.onerror = () => reject(new Error("Error reading file"));
          reader.readAsText(file);
        });
      } else {
        return Promise.reject(new Error("Please upload a valid JSON file."));
      }
    },
  });
};
