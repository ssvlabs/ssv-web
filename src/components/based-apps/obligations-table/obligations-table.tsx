import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
} from "@/components/ui/table.tsx";
import ObligationTableRow from "@/components/based-apps/obligations-table/obligation-table-row.tsx";

const ObligationsTable = ({
  obligations,
  strategyId,
  isObligationManage,
}: {
  obligations: `0x${string}`[];
  strategyId: string;
  isObligationManage?: boolean;
}) => {
  return (
    <div className="flex flex-col w-full">
      <Table className={"w-full rounded-xl overflow-hidden"}>
        <TableHeader>
          <TableHead>Asset</TableHead>
          <TableHead>Contract Address</TableHead>
          {isObligationManage && (
            <TableHead className={"text-right"}>Obligation</TableHead>
          )}
          <TableHead className="flex items-center justify-end">
            Set Obligations
          </TableHead>
        </TableHeader>
        <TableBody>
          {obligations?.map((obligation: `0x${string}`) => (
            <ObligationTableRow
              strategyId={strategyId}
              obligation={obligation}
              isObligationManage={isObligationManage}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ObligationsTable;
