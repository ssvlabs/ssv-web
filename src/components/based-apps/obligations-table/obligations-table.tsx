import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
} from "@/components/ui/table.tsx";
import ObligationTableRow from "@/components/based-apps/obligations-table/obligation-table-row.tsx";

const ObligationsTable = ({
  obligations,
}: {
  obligations: `0x${string}`[];
}) => {
  return (
    <div className="flex flex-col w-full">
      <Table className={"w-full rounded-t-xl overflow-hidden"}>
        <TableHeader>
          <TableHead>Asset</TableHead>
          <TableHead>Contract Address</TableHead>
          <TableHead>Set Obligations</TableHead>
        </TableHeader>
        <TableBody>
          {obligations?.map((obligation: `0x${string}`) => (
            <ObligationTableRow obligation={obligation} />
          ))}
          {/*<ObligationTableRow*/}
          {/*  obligation={{*/}
          {/*    id: "1",*/}
          {/*    address: "0xF90c557362C7f0AB7f32F725664a98fEccE9d384",*/}
          {/*    name: "SSV Network",*/}
          {/*  }}*/}
          {/*/>*/}
        </TableBody>
      </Table>
    </div>
  );
};

export default ObligationsTable;
