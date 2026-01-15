import { Text } from "@/components/ui/text";
import { useLocalStorage } from "react-use";
import { FaXmark } from "react-icons/fa6";
import type { FC } from "react";

const STORAGE_KEY = "eth-funding-migration-dismissed";

export const EthFundingMigrationBanner: FC = () => {
  const [isDismissed, setIsDismissed] = useLocalStorage(STORAGE_KEY, false);

  if (isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <div className="bg-orange-500 flex items-center justify-center px-5 py-4 relative w-full">
      <div className="flex-1 flex items-center justify-center">
        <Text variant="body-2-medium" className="text-white text-center">
          ETH fees are now active. Switch to ETH to regain full cluster
          management capabilities.
        </Text>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-5 top-1/2 -translate-y-1/2 text-white hover:opacity-80 transition-opacity"
        aria-label="Dismiss banner"
      >
        <FaXmark className="size-6" />
      </button>
    </div>
  );
};

EthFundingMigrationBanner.displayName = "EthFundingMigrationBanner";
