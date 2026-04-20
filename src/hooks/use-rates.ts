import { ms } from "@/lib/utils/number";
import { useQuery } from "@tanstack/react-query";

interface RatesResponse {
  apr: number;
  boost: number;
  eth: number;
  operators: number;
  ssv: number;
  timestamp: string;
  validators: number;
}

export const useRates = () => {
  return useQuery({
    staleTime: ms(2, "hours"),
    queryKey: ["rates"],
    queryFn: async () => {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,ssv-network&vs_currencies=usd",
      );
      if (!res.ok) throw new Error("Failed to fetch rates");
      const data = await res.json();

      // Transform CoinGecko response to match our RatesResponse format
      return {
        eth: data.ethereum?.usd ?? 0,
        ssv: data["ssv-network"]?.usd ?? 0,
        apr: 0,
        boost: 0,
        operators: 0,
        validators: 0,
        timestamp: new Date().toISOString(),
      } as RatesResponse;
    },
  });
};
