import { ms } from "@/lib/utils/number";
import { useQuery } from "@tanstack/react-query";

export const useRates = () => {
  return useQuery({
    staleTime: ms(2, "hours"),
    queryKey: ["rates"],
    queryFn: async () => {
      const res = await fetch(
        "https://ssv-price-8c98717db454.herokuapp.com/data",
      );
      if (!res.ok) throw new Error("Failed to fetch rates");
      return res.json() as Promise<{ ssv: number }>;
    },
  });
};
