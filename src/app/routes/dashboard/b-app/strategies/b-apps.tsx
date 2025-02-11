import { Container } from "@/components/ui/container.tsx";
import { Text } from "@/components/ui/text.tsx";
import { SearchInput } from "@/components/ui/search-input.tsx";
import { BAppsTable } from "@/components/based-apps/b-app-table/b-apps-table.tsx";

const BApps = () => {
  return (
    <Container variant="vertical" size="xl" className="py-6">
      <div className="flex justify-between w-full items-center">
        <Text variant="body-1-semibold">Select bApp</Text>
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Search"
            iconPlacement="left"
            className="h-10 rounded-xl bg-gray-50 text-sm w-[536px] max-w-full"
            inputProps={{
              className: "bg-gray-50",
              placeholder: "Search Account...",
            }}
          />
        </div>
      </div>
      <BAppsTable />
    </Container>
  );
};

export default BApps;
