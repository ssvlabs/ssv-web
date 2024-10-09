import {
  checkUserCountryRestriction,
  getCurrentLocation,
  getRestrictedCountries,
} from "@/api/ssv";
import { ms } from "@/lib/utils/number";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "react-use";
import { useAccount } from "wagmi";

export const useCompliance = () => {
  const [disabled] = useLocalStorage("locationRestrictionDisabled", false);

  const account = useAccount();

  const userLocation = useQuery({
    queryKey: ["userLocation"],
    queryFn: getCurrentLocation,
  });

  const restrictedLocations = useQuery({
    staleTime: ms(1, "days"),
    queryKey: ["restrictedLocations"],
    queryFn: getRestrictedCountries,
  });

  return useQuery({
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
