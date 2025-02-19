import { Text } from "@/components/ui/text.tsx";
import { useAsset } from "@/hooks/use-asset";

const AssetName = ({ address }: { address: `0x${string}` }) => {
  const asset = useAsset(address);
  return (
    <div className="flex items-center gap-2">
      {asset.name}
      <Text className="text-gray-500 font-medium">{asset.symbol}</Text>
    </div>
  );
};

export default AssetName;
