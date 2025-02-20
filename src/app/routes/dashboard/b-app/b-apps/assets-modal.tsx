import { Text } from "@/components/ui/text.tsx";
import type { BAppAsset } from "@/api/b-app.ts";
import { SearchInput } from "@/components/ui/search-input.tsx";
import { Table } from "@/components/ui/grid-table.tsx";
import { useState } from "react";
import AssetRow from "@/app/routes/dashboard/b-app/b-apps/asset-row.tsx";
import { useCreateBAppContext } from "@/guard/create-b-app-context.ts";

const AssetsModal = ({
  closeModal,
  assets,
  rowIndex,
}: {
  rowIndex: number;
  closeModal: () => void;
  assets: BAppAsset[];
}) => {
  const [search, setSearch] = useState("");
  return (
    <div
      style={{ backgroundColor: "rgba(11, 42, 60, 0.16)" }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
    >
      <div className="w-[648px] max-h-[596px] relative rounded-lg shadow-lg bg-background">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center pt-6 px-6">
            <Text className="font-bold text-xl">Select Asset</Text>
            <button
              onClick={closeModal}
              className="text-gray-600 hover:text-gray-800"
            >
              &#10005;
            </button>
          </div>
          <div className="flex flex-row justify-between items-center pt-6 px-6">
            <SearchInput
              onChange={(e) => setSearch(e.target.value)}
              placeholder={"Search by Name or Token Address..."}
            />
          </div>
          <Table
            gridTemplateColumns="1fr auto"
            className="flex-1 w-full m-0 p-0 max-h-[432px]"
          >
            {assets.map(({ token }) => (
              <AssetRow
                onClick={() => {
                  useCreateBAppContext.state.addAsset(rowIndex, token);
                  closeModal();
                }}
                searchValue={search}
                token={token}
              />
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AssetsModal;
