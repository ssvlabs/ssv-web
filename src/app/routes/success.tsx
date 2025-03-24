import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { useAccount } from "@/hooks/account/use-account";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { getWalletIconSrc } from "@/components/connect-wallet/connect-wallet-btn";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const addTokenToWallet = async (tokenAddress: `0x${string}`) => {
  try {
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol: "SSV",
          decimals: 18,
        },
      },
    });
    toast({
      title: "Success",
      description: "Added SSV token to your wallet!",
    });
  } catch (error: unknown) {
    console.error("Cannot add SSV token to wallet", error);
    toast({
      title: "Error",
      description: `Failed to add SSV token to wallet: ${error instanceof Error ? error.message : String(error)}`,
      variant: "destructive",
    });
  }
};

export const Success = () => {
  const { chain, connector } = useAccount();
  const ssvNetworkDetails = useSSVNetworkDetails();

  const addSSVTokenMutation = useMutation({
    mutationFn: addTokenToWallet,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "SSV tokens requested successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to request SSV tokens: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return (
    <Container className="max-w-[648px] py-8">
      <Card>
        <Text variant="headline4">SSV Faucet {chain?.name} Testnet</Text>
        <Text variant="body-2-medium">
          Testnet SSV was successfully sent to your wallet - you can now go back
          to fund your account.
        </Text>
        <Text variant="body-2-medium">
          Please note that funds might take a few minutes to arrive.
        </Text>

        <Text variant="body-2-medium">Can't find your tokens?</Text>

        <div className="flex flex-col gap-4">
          <Button
            size="xl"
            variant="outline"
            className="w-full"
            isLoading={addSSVTokenMutation.isPending}
            onClick={() =>
              ssvNetworkDetails?.tokenAddress &&
              addSSVTokenMutation.mutate(ssvNetworkDetails.tokenAddress)
            }
          >
            <div className="flex items-center gap-2">
              <img
                src={getWalletIconSrc(connector?.name)}
                className="size-6 mr-2"
              />
              <Text>Add SSV Token to {connector?.name || "Metamask"}</Text>
              {addSSVTokenMutation.isSuccess && (
                <Check className="size-4 text-success-500" />
              )}
            </div>
          </Button>
          <Button as={Link} to="/request" size="xl" className="w-full">
            Request More SSV
          </Button>
        </div>
      </Card>
    </Container>
  );
};
