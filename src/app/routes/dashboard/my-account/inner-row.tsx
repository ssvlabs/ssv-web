import { TableCell, TableRow } from "@/components/ui/table.tsx";
import type { ReactNode } from "react";
import { useState } from "react";
import { FaArrowUpLong } from "react-icons/fa6";
import { FaArrowDownLong } from "react-icons/fa6";

const InnerRow = ({ data }: { data: (string | ReactNode)[] }) => {
  const [rowOnFocus, setRowOnFocus] = useState(false);
  return (
    <TableRow
      onFocus={() => setRowOnFocus(!rowOnFocus)}
      onMouseEnter={() => setRowOnFocus(true)}
      onMouseLeave={() => setRowOnFocus(false)}
      className="bg-gray-100 hover:bg-primary-50"
    >
      {data.map((row) => (
        <TableCell>{row}</TableCell>
      ))}
      <TableCell>
        {rowOnFocus ? (
          <div className="flex items-center justify-center gap-1">
            <div className="size-8 rounded-[8px] flex items-center justify-center bg-gray-300">
              <FaArrowDownLong className="text-white" />
            </div>
            <div className="size-8 rounded-[8px] flex items-center justify-center border border-primary-500 bg-primary-100">
              <FaArrowUpLong className="text-primary-500" />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1">
            <div className="size-8" />
            <div className="size-8" />
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default InnerRow;
