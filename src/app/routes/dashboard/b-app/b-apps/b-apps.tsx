import { Container } from "@/components/ui/container.tsx";
import { Text } from "@/components/ui/text.tsx";
import { SearchInput } from "@/components/ui/search-input.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BAppsTable } from "@/components/based-apps/b-app-table/b-apps-table.tsx";
import { useBApps } from "@/hooks/b-app/use-b-apps.ts";

const BApps = () => {
  const { bApps, pagination, isBAppsLoading } = useBApps();
  const [, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

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
        </div>
      </div>
      <BAppsTable
        isLoading={isBAppsLoading}
        bApps={bApps}
        pagination={pagination}
        onRowClick={(bApp) => {
          navigate(`/account/bApps/${bApp.id}`);
        }}
      />
    </Container>
  );
};

export default BApps;
