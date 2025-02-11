import {
  TableHeader,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import BAppsTableRow from "@/components/based-apps/b-app-table/b-apps-table-row.tsx";

export const BAppsTable = () => {
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
          {/*<BAppsTableRow bApp={{ id: "123", name: "123" }} />*/}
          {/*<BAppsTableRow bApp={{ id: "123", name: "123" }} />*/}
          {/*<BAppsTableRow*/}
          {/*  bApp={{ id: "123", name: "serviceHowLongHowLongLongName 378" }}*/}
          {/*/>*/}
          <BAppsTableRow
            bApp={{ id: "123", name: "serviceHowLongHowLongLongName 378" }}
          />
        </TableBody>
      </Table>
    </div>
  );
};

BAppsTable.displayName = "BAppsTable";
