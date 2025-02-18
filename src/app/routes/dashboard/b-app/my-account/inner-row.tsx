import { TableCell, TableRow } from "@/components/ui/table.tsx";
import type { ReactNode } from "react";
import { useState } from "react";
import { FaArrowUpLong } from "react-icons/fa6";
import { FaArrowDownLong } from "react-icons/fa6";
import { textVariants } from "@/components/ui/text.tsx";

const InnerRow = ({
  data,
}: {
  data: { innerRow: (string | ReactNode)[]; sizes: number[] };
}) => {
  const [rowOnFocus, setRowOnFocus] = useState(false);

  return (
    <TableRow
      onFocus={() => setRowOnFocus(!rowOnFocus)}
      onMouseEnter={() => setRowOnFocus(true)}
      onMouseLeave={() => setRowOnFocus(false)}
      className="h-[52px] bg-gray-100 hover:bg-primary-50 p-0"
    >
      {data.innerRow.map((row) => {
        return (
          <TableCell
            className={`${textVariants({ variant: "body-3-medium" })} py-0`}
          >
            {row}
          </TableCell>
        );
      })}
      <TableCell className="p-0 m-0 pr-3">
        {rowOnFocus && (
          <div className="flex items-center justify-center gap-1 m-0 p-0">
            <div className="size-8 rounded-[8px] flex items-center justify-center bg-gray-300">
              <FaArrowDownLong className="text-white" />
            </div>
            <div className="size-8 rounded-[8px] flex items-center justify-center border border-primary-500 bg-primary-100">
              <FaArrowUpLong className="text-primary-500" />
            </div>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default InnerRow;
