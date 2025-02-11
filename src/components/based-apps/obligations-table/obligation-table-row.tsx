import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { Button } from "@/components/ui/button.tsx";
import { textVariants } from "@/components/ui/text.tsx";

const ObligationTableRow = ({
  obligation,
}: {
  obligation: { id: string; address: string; name: string };
}) => {
  return (
    <TableRow key={obligation.id} className={"cursor-pointer max-h-7"}>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {obligation.name}
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {shortenAddress(obligation.address)}
      </TableCell>
      <TableCell
        className={`${textVariants({ variant: "body-3-medium" })} py-0`}
      >
        <div className="w-full flex justify-end items-center">
          <Button
            className={`${textVariants({ variant: "body-3-medium" })} text-white w-[116px] h-[32px]`}
          >
            Add
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ObligationTableRow;
