import { Text } from "@/components/ui/text";
import { useLocalStorage } from "react-use";
import { FaXmark } from "react-icons/fa6";
import type { FC } from "react";
import { Link } from "react-router-dom";

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
    <div
      data-testid="eth-funding-migration-banner"
      className="bg-orange-400 flex items-center justify-center px-5 py-4 relative w-full"
    >
      <div className="flex-1 flex items-center justify-center">
        <Text
          data-testid="eth-funding-migration-banner-message"
          variant="body-2-medium"
          className="text-white text-center"
        >
          ETH fees are now active. Switch to ETH to regain full cluster management capabilities. <Link data-testid="eth-funding-migration-banner-read-more-link" className={"text-[#7F35BA] underline"} target={"_blank"} to={'http://docs.ssv.network/stakers/cluster-management/migrating-to-eth-clusters'}>Read more.</Link>
        </Text>
      </div>
      <button
        data-testid="eth-funding-migration-banner-dismiss-btn"
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
