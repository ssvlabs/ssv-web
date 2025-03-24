import { Redirector } from "@/app/routes/root-redirection";
import robotRocket from "@/assets/images/robot-rocket.svg";
import { ConnectWalletBtn } from "@/components/connect-wallet/connect-wallet-btn";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useAccount } from "@/hooks/account/use-account";
import type { ComponentPropsWithoutRef, FC } from "react";

export const ConnectWallet: FC<ComponentPropsWithoutRef<"div">> = () => {
  const { isConnected } = useAccount();

  if (isConnected) {
    return <Redirector />;
  }

  return (
    <Card className="max-w-[648px] mx-auto p-8 gap-8">
      <div className="flex flex-col gap-4">
        <Text variant="headline1">SSV Faucet Testnet</Text>
        <Text variant="body-2-medium" className="text-gray-700">
          Connect your wallet to receive testnet SSV for testing purposes.
        </Text>
      </div>
      <img src={robotRocket} className="h-[274px] mx-auto" />
      <Alert variant="warning">
        Funds received through the SSV faucet are not real funds and hold no
        value.
      </Alert>
      <ConnectWalletBtn size="xl" />
    </Card>
  );
};

ConnectWallet.displayName = "ConnectWallet";
