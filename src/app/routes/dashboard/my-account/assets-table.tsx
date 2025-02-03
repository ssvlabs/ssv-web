import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import type { ReactNode } from "react";
import { useState } from "react";
import InnerRow from "@/app/routes/dashboard/my-account/inner-row.tsx";
import { Button } from "@/components/ui/button.tsx";

const AssetsTable = ({
  tableHeads,
  data,
  onRowClick,
}: {
  onRowClick: () => void;
  tableHeads: {
    label: string | ReactNode;
    size: number;
    textAlign?: string;
  }[];
  data: {
    rows: (string | ReactNode)[];
    // onRowClick: () => void;
    hasInnerTable?: boolean;
    innerData?: (string | ReactNode)[][];
  }[];
}) => {
  console.log(tableHeads);
  const [openedTableIndex, setOpenedTableIndex] = useState(-1);
  const [focusedRowIndex, setFocusedRowIndex] = useState(-1);
  return (
    <Table>
      <TableHeader>
        {tableHeads.map(
          (tableHead: {
            label: string | ReactNode;
            size: number;
            textAlign?: string;
          }) => (
            <TableHead
              className={`w-[${tableHead.size}px] ${tableHead.textAlign}`}
            >
              {tableHead.label}
            </TableHead>
          ),
        )}
      </TableHeader>
      {data.map(({ rows, hasInnerTable, innerData }, index) => {
        const AngleComponent =
          openedTableIndex === index ? FaAngleUp : FaAngleDown;
        return (
          <TableBody>
            <TableRow
              className="hover:bg-primary-50"
              onMouseEnter={() => setFocusedRowIndex(index)}
              onMouseLeave={() => setFocusedRowIndex(-1)}
            >
              {rows.map((row: string | ReactNode) => (
                <TableCell onClick={onRowClick}>{row}</TableCell>
              ))}
              <TableCell>
                {hasInnerTable && innerData ? (
                  <AngleComponent
                    onClick={() =>
                      setOpenedTableIndex(
                        index === openedTableIndex ? -1 : index,
                      )
                    }
                  />
                ) : index === focusedRowIndex ? (
                  <Button>Delegate</Button>
                ) : (
                  ""
                )}
              </TableCell>
            </TableRow>
            {openedTableIndex === index &&
              innerData &&
              innerData.map((innerRow: (string | ReactNode)[]) => (
                <InnerRow data={innerRow} />
              ))}
          </TableBody>
        );
      })}
    </Table>
  );
};

export default AssetsTable;
