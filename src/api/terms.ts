import { api } from "@/lib/api-client.ts";
import { endpoint } from "@/api/index.ts";

export const acceptTermsAndConditions = async (walletAddress: string) => {
  return await api.post(endpoint("terms"), { walletAddress });
};
