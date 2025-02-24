import { useBApps } from "@/hooks/b-app/use-b-apps.ts";
import { Link, useSearchParams } from "react-router-dom";
import { Container } from "@/components/ui/container.tsx";
import { Text } from "@/components/ui/text.tsx";
import { SearchInput } from "@/components/ui/search-input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { BAppsTable } from "@/components/based-apps/b-app-table/b-apps-table.tsx";

const AccountBApps = () => {
  const { bApps, pagination, isBAppsLoading } = useBApps();
  const [, setSearchParams] = useSearchParams();

  const searchById = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("id", e.target.value);
      return params;
    });
  };
  return (
    <Container variant="vertical" size="xl" className="py-6">
      <div className="flex justify-between w-full items-center">
        <Text variant="body-1-semibold">bApps</Text>
        <div className="flex items-center gap-2">
          <SearchInput
            onChange={searchById}
            placeholder="Search"
            iconPlacement="left"
            className="h-10 rounded-xl bg-gray-50 text-sm w-[536px] max-w-full"
            inputProps={{
              className: "bg-gray-50",
              placeholder: "Search bApp...",
            }}
          />
          <Button as={Link} to={"create"} size="sm" className="px-5 h-10">
            Create bApp
          </Button>
        </div>
      </div>
      <BAppsTable
        isLoading={isBAppsLoading}
        bApps={bApps}
        pagination={pagination}
      />
    </Container>
  );
};

export default AccountBApps;
