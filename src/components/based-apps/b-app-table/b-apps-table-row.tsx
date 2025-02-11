import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { textVariants } from "@/components/ui/text.tsx";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { AssetsDisplay } from "@/components/ui/assets-display.tsx";
import { Button } from "@/components/ui/button.tsx";

const BAppsTableRow = ({ bApp }: { bApp: { id: string; name: string } }) => {
  return (
    <TableRow key={bApp.id} className={"cursor-pointer max-h-7"}>
      <TableCell
        className={`${textVariants({ variant: "body-3-medium" })} flex items-center gap-2`}
      >
        <img
          className="rounded-[8px] size-7 border-gray-400 border"
          src={"/images/operator_default_background/light.svg"}
        />
        {bApp.name}
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {shortenAddress("0xF90c557362C7f0AB7f32F725664a98fEccE9d384")}
      </TableCell>
      <TableCell>
        <AssetsDisplay
          max={3}
          addresses={[
            "0x9D65fF81a3c488d585bBfb0Bfe3c7707c7917f54",
            "0x9D65fF81a3c488d585bBfb0Bfe3c7707c7917f54",
            "0x9D65fF81a3c488d585bBfb0Bfe3c7707c7917f54",
          ]}
        />
      </TableCell>
      <TableCell>
        <div className="w-7 h-6 rounded-[4px] bg-primary-100 border border-primary-500 text-primary-500 flex items-center justify-center text-[10px]">
          3
        </div>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        132
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        $ 339M
      </TableCell>
      <TableCell className="p-0">
        <Button
          className={`${textVariants({ variant: "body-3-medium" })} text-white`}
        >
          Select
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default BAppsTableRow;
