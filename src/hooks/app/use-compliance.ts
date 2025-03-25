import {
  checkUserCountryRestriction,
  getCurrentLocation,
  getRestrictedCountries,
} from "@/api/ssv";
import { ms } from "@/lib/utils/number";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import { useLocalStorage } from "react-use";
import { useAccount } from "wagmi";

export const useCompliance = () => {
  const [disabled] = useLocalStorage("locationRestrictionDisabled", false);

  const account = useAccount();

  const userLocation = useChainedQuery({
    queryKey: ["userLocation"],
    queryFn: getCurrentLocation,
  });

  const restrictedLocations = useChainedQuery({
    staleTime: ms(1, "days"),
    queryKey: ["restrictedLocations"],
    queryFn: getRestrictedCountries,
  });

  return useChainedQuery({
    queryKey: ["compliance", account.chain, account.isConnected, disabled],
    queryFn: () => {
      if (!account.isConnected || account.chain?.testnet || disabled) return "";
      return checkUserCountryRestriction(
        userLocation.data!,
        restrictedLocations.data!,
      );
    },
    enabled: !!userLocation.data && !!restrictedLocations.data,
  });
};
