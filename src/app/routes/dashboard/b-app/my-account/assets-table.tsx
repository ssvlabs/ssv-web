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
import InnerRow from "@/app/routes/dashboard/b-app/my-account/inner-row.tsx";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils/tw.ts";
import { textVariants } from "@/components/ui/text.tsx";
import type { Pagination as PaginationType } from "@/types/api.ts";
import { Divider } from "@/components/ui/divider.tsx";
import { Pagination } from "@/components/ui/pagination-v2.tsx";
import { Loading } from "@/components/ui/Loading.tsx";
import { Text } from "@/components/ui/text.tsx";

const AssetsTable = ({
  tableHeads,
  data,
  onRowClick,
  showDelegateBtn,
  onDelegateClick,
  isLoading,
  pagination,
}: {
  onRowClick?: () => void;
  showDelegateBtn?: boolean;
  onDelegateClick?: (address: string) => void;
  tableHeads: {
    label: string | ReactNode;
    size: number;
    textAlign?: string;
  }[];
  data: {
    rows: (string | ReactNode)[];
    hasInnerTable?: boolean;
    address?: string;
    innerData?: (string | ReactNode)[][];
  }[];
  isLoading?: boolean;
  pagination?: PaginationType;
}) => {
  const [openedTableIndex, setOpenedTableIndex] = useState(-1);
  const [focusedRowIndex, setFocusedRowIndex] = useState(-1);
  return (
    <div className="flex flex-col w-full overflow-y-hidden max-h-[700px]">
      <Table className={cn("w-full rounded-t-xl")}>
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
        {!isLoading &&
          data.map(({ rows, hasInnerTable, innerData, address }, index) => {
            const AngleComponent =
              openedTableIndex === index ? FaAngleUp : FaAngleDown;
            return (
              <TableBody className="border-t border-b border-gray-300">
                <TableRow
                  className="h-[52px] hover:bg-primary-50"
                  onMouseEnter={() => setFocusedRowIndex(index)}
                  onMouseLeave={() => setFocusedRowIndex(-1)}
                >
                  {rows.map((row: string | ReactNode, rowIndex) => {
                    if (rowIndex === rows.length - 1) {
                      return (
                        <TableCell
                          key={index}
                          onClick={onRowClick}
                          className={`py-0 h-[52px] ${tableHeads[rowIndex].textAlign} ${textVariants({ variant: "body-3-medium" })}`}
                        >
                          {index === focusedRowIndex &&
                          showDelegateBtn &&
                          onDelegateClick ? (
                            <Button
                              onClick={() => {
                                onDelegateClick(address || "");
                              }}
                              className="m-0"
                            >
                              Delegate
                            </Button>
                          ) : (
                            row
                          )}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell
                        key={index}
                        className={`py-0 h-[52px] ${tableHeads[rowIndex].textAlign} ${textVariants({ variant: "body-3-medium" })}`}
                        onClick={onRowClick}
                      >
                        {row}
                      </TableCell>
                    );
                  })}
                  {hasInnerTable && innerData ? (
                    <TableCell className="h-[52px] py-0 text-right w-20">
                      <AngleComponent
                        onClick={() =>
                          setOpenedTableIndex(
                            index === openedTableIndex ? -1 : index,
                          )
                        }
                      />
                    </TableCell>
                  ) : (
                    !showDelegateBtn && (
                      <TableCell className="h-[52px] py-0 text-right w-20"></TableCell>
                    )
                  )}
                </TableRow>
                {openedTableIndex === index &&
                  innerData &&
                  innerData.map((innerRow: (string | ReactNode)[], index) => (
                    <InnerRow
                      key={index}
                      data={{
                        innerRow,
                        sizes: tableHeads.map(({ size }) => size),
                      }}
                    />
                  ))}
              </TableBody>
            );
          })}
      </Table>
      <div className="bg-gray-50 w-full">{isLoading && <Loading />}</div>
      {!data.length && !isLoading && (
        <div className="bg-gray-50 w-full h-[200px] flex flex-col items-center gap-4 justify-center">
          <Text variant="body-3-medium">
            You don’t have any assets in your wallet
          </Text>
          <Button>Explore Strategies</Button>
        </div>
      )}
      {pagination && pagination.pages > 1 && (
        <>
          <Divider />
          <div className="flex w-full bg-gray-50 rounded-b-2xl">
            <Pagination pagination={pagination} />
          </div>
        </>
      )}
    </div>
  );
};

export default AssetsTable;
