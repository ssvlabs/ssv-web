import {
  TableHeader,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import BAppsTableRow from "@/components/based-apps/b-app-table/b-apps-table-row.tsx";
import type { BApp } from "@/api/b-app.ts";
import { Divider } from "@/components/ui/divider.tsx";
import { Pagination } from "@/components/ui/pagination-v2.tsx";
import type { Pagination as IPagination } from "@/types/api";

export const BAppsTable = ({
  bApps,
  isCreateFlow,
  pagination,
}: {
  bApps?: BApp[];
  isCreateFlow?: boolean;
  pagination?: IPagination;
}) => {
  return (
    <div className="flex flex-col w-full">
      <Table className={"w-full rounded-t-xl overflow-hidden"}>
        <TableHeader>
          <TableHead>bApp</TableHead>
          <TableHead>Owner Address</TableHead>
          <TableHead>Supported Assets</TableHead>
          <TableHead>Strategies</TableHead>
          <TableHead>Delegators</TableHead>
          <TableHead>Total Delegated Value</TableHead>
          <TableHead></TableHead>
        </TableHeader>
        <TableBody>
          {(bApps || []).map((bApp: BApp) => (
            <BAppsTableRow isCreateFlow={isCreateFlow} bApp={bApp} />
          ))}
        </TableBody>
      </Table>
      {pagination && pagination?.pages > 1 ? (
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
