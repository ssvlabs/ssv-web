import { TableCell, TableRow } from "@/components/ui/grid-table.tsx";
import { AssetLogo } from "@/components/ui/asset-logo.tsx";
import AssetName from "@/components/ui/asset-name.tsx";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { TbExternalLink } from "react-icons/tb";
import { useLinks } from "@/hooks/use-links.ts";
import { useAsset } from "@/hooks/use-asset.ts";

const AssetRow = ({
  token,
  searchValue,
  onClick,
}: {
  token: `0x${string}`;
  searchValue: string;
  onClick?: () => void;
}) => {
  const { etherscan } = useLinks();
  const { name, symbol } = useAsset(token);
  if (
    searchValue &&
    !(name && name.toLowerCase().includes(searchValue.toLowerCase())) &&
    !(symbol && symbol.toLowerCase().includes(searchValue.toLowerCase())) &&
    !token.toLowerCase().includes(searchValue.toLowerCase())
  ) {
    return;
  }

  return (
    <TableRow onClick={onClick} className="h-[60px] w-full">
      <TableCell className="flex gap-1 items-center">
        <AssetLogo className="size-6" address={token} />
        <AssetName address={token} />
      </TableCell>
      <TableCell>
        <a
          target="_blank"
          href={`${etherscan}/token/${token}`}
          className="flex items-center gap-1 text-[12px] text-primary-500 rounded-[4px] bg-primary-50 px-2 py-1 cursor-pointer"
        >
          {shortenAddress(token)}
          <TbExternalLink className="size-3" />
        </a>
      </TableCell>
    </TableRow>
  );
};

export default AssetRow;
