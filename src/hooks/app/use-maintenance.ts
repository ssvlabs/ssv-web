import { useLocalStorage } from "react-use";
import { useChainId } from "wagmi";

export const useMaintenance = () => {
  const chainId = useChainId();

  const [isMaintenancePage] = useLocalStorage("isMaintenancePage", false, {
    raw: false,
    deserializer: (value) => Boolean(value),
    serializer: (value) => String(value),
  });

  return { isMaintenancePage: chainId !== 1 || isMaintenancePage };
};
