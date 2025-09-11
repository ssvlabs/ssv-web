import { useLocalStorage } from "react-use";
import { useChainId } from "wagmi";

export const useMaintenance = () => {
  const chainId = useChainId();

  const initialValue = chainId !== 1;

  const [isMaintenancePage] = useLocalStorage(
    "isMaintenancePage",
    initialValue,
    {
      raw: false,
      deserializer: (value) => Boolean(value),
      serializer: (value) => String(value),
    },
  );

  return { isMaintenancePage };
};
