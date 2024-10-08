import { useLocalStorage } from "react-use";

export const useMaintenance = () => {
  const [isMaintenancePage] = useLocalStorage("isMaintenancePage", false, {
    raw: false,
    deserializer: (value) => Boolean(value),
    serializer: (value) => String(value),
  });

  return { isMaintenancePage };
};
