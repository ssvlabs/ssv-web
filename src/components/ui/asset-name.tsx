import { useReadContract } from "wagmi";
import { TokenABI } from "@/lib/abi/token.ts";
import { isEthereumAddress } from "@/lib/utils/token.ts";
import { Text } from "@/components/ui/text.tsx";

const AssetName = ({ address }: { address: `0x${string}` }) => {
  const isEthereum = isEthereumAddress(address);

  const { data: tokenName = "Ethereum" } = useReadContract({
    abi: TokenABI,
    functionName: "name",
    address,
    query: {
      staleTime: Infinity,
      enabled: !isEthereum,
    },
  });

  const { data: tokenSymbol = "ETH" } = useReadContract({
    abi: TokenABI,
    functionName: "symbol",
    address,
    query: {
      staleTime: Infinity,
      enabled: !isEthereum,
    },
  });
  console.log(tokenName);
  return (
    <div className="flex items-center gap-2">
      {tokenName}
      <Text className="text-gray-500 font-medium">{tokenSymbol}</Text>
    </div>
  );
};

export default AssetName;
