import { useQuery } from "@tanstack/react-query";
import { validateMetadata } from "@/api/b-app.ts";

export const useRequestMetadataByURI = ({
  strategyMetadataURI,
  accountMetadataURI,
}: {
  strategyMetadataURI?: string;
  accountMetadataURI?: string;
}) => {
  const strategyMetadata = useQuery({
    queryKey: ["strategy_metadata", strategyMetadataURI],
    queryFn: () => strategyMetadataURI && validateMetadata(strategyMetadataURI),
    enabled: Boolean(strategyMetadataURI),
  });

  const accountMetadata = useQuery({
    queryKey: ["strategy_metadata", accountMetadataURI],
    queryFn: () => accountMetadataURI && validateMetadata(accountMetadataURI),
    enabled: Boolean(accountMetadataURI),
  });

  return { strategyMetadata, accountMetadata };
};
