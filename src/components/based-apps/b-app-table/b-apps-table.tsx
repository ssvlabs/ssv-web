import {
  TableHeader,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import BAppsTableRow from "@/components/based-apps/b-app-table/b-apps-table-row.tsx";
import type { BApp, BAppsMetaData } from "@/api/b-app.ts";
import { Divider } from "@/components/ui/divider.tsx";
import { Pagination } from "@/components/ui/pagination-v2.tsx";
import type { Pagination as IPagination } from "@/types/api";
import { Loading } from "@/components/ui/Loading.tsx";

type BAppsTableProps = {
  bApps?: (BApp & BAppsMetaData)[];
  isCreateFlow?: boolean;
  isLoading?: boolean;
  pagination?: IPagination;
  onRowClick?: (bApp: BApp) => void;
  isClickable?: boolean;
};

export const BAppsTable = ({
  bApps,
  isCreateFlow,
  pagination,
  isLoading,
  onRowClick,
  isClickable = true,
}: BAppsTableProps) => {
  return (
    <div className="flex flex-col w-full">
      <Table className={"w-full rounded-t-xl overflow-hidden"}>
        <TableHeader>
          <TableHead className="w-[40%]">bApp</TableHead>
          <TableHead className="w-[14%]">bApp Address</TableHead>
          <TableHead className="w-[14%]">Supported Assets</TableHead>
          <TableHead className="text-right w-[7%]">Strategies</TableHead>
          <TableHead className="text-right w-[7%]">Delegators</TableHead>
          <TableHead className="text-right w-[7%]">Depositors</TableHead>
          <TableHead className="text-right w-[15%]">
            Total Asset Value
          </TableHead>
          {isCreateFlow && <TableHead></TableHead>}
        </TableHeader>
        <TableBody>
          {(bApps || []).map((bApp: BApp & BAppsMetaData, index) => (
            <BAppsTableRow
              key={index}
              isCreateFlow={isCreateFlow}
              bApp={bApp}
              onRowClick={() => onRowClick?.(bApp)}
              isClickable={isClickable}
            />
          ))}
        </TableBody>
      </Table>
      <div className="bg-gray-50 w-full">{isLoading && <Loading />}</div>
      {pagination && pagination?.total > 10 ? (
        <>
          <Divider />
          <div className="flex w-full bg-gray-50 py-4 rounded-b-2xl">
            <Pagination pagination={pagination} />
          </div>
        </>
      ) : (
        <div className="flex w-full bg-gray-50 py-4 rounded-b-2xl"></div>
      )}
    </div>
  );
};

BAppsTable.displayName = "BAppsTable";
