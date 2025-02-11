import { BAppsTable } from "@/components/based-apps/b-app-table/b-apps-table.tsx";
import { Container } from "@/components/ui/container.tsx";
import { Input } from "@/components/ui/input.tsx";
import ObligationsTable from "@/components/based-apps/obligations-table/obligations-table.tsx";

const Obligations = () => {
  return (
    <Container variant="vertical" size="xl" className="py-6">
      <BAppsTable />
      <div className="size-full px-6 py-4 rounded-[16px] bg-white">
        <Input className="h-10" />
      </div>
      <ObligationsTable />
    </Container>
  );
};

export default Obligations;
