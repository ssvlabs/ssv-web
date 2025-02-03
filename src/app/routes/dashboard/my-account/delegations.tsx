import { Text } from "@/components/ui/text.tsx";
import AssetsTable from "@/app/routes/dashboard/my-account/assets-table.tsx";
import { Container } from "@/components/ui/container.tsx";
import { useNavigate } from "react-router-dom";

const MOCK_DATA_NON_SLASHABLE_ASSETS = {
  tableHeads: [
    {
      label: "Non Slashable Assets",
      size: 320,
    },
    {
      label: "Delegated Accounts",
      size: 204,
    },
    {
      label: "Delegated",
      textAlign: "text-right",
      size: 248,
    },
    {
      label: "Total Delegated Value",
      size: 248,
      textAlign: "text-right",
      extendedClass: "flex flex-end items-center bg-red",
    },
    {
      label: "SSV Balance",
      textAlign: "text-right",
      size: 248,
    },
    {
      label: "",
      size: 52,
    },
  ],
  data: [
    {
      hasInnerTable: true,
      rows: [
        <div className="flex gap-2 w-[320px]">
          <img
            className={"h-[24px] w-[15px]"}
            src={`/images/balance-validator/balance-validator.svg`}
          />
          Validator Balance
          <Text className="text-gray-500 font-medium">ETH</Text>
        </div>,
        <div className="w-7 h-6 rounded-[4px] bg-primary-100 border border-primary-500 text-primary-500 flex items-center justify-center text-[10px]">
          2
        </div>,
        <div className="text-right">64,000</div>,
        <div className="text-right">64,000</div>,
        <div className="text-right">64,000</div>,
      ],
      innerData: [
        [
          "",
          <div className="flex items-center gap-2 w-[320px]">
            <img
              className="w-7 rounded-[8px] border-gray-400 border"
              src={"/images/operator_default_background/light.svg"}
            />
            <Text>address7 (me)</Text>
          </div>,
          <div className="text-right">64,000</div>,
          <div className="text-right">400k</div>,
          <div className="text-right">64,000</div>,
        ],
        [
          "",
          <div className="flex items-center gap-2 w-[320px]">
            <img
              className="w-7 rounded-[8px] border-gray-400 border"
              src={"/images/operator_default_background/light.svg"}
            />
            <Text>address8</Text>
          </div>,
          <div className="text-right">64,000</div>,
          <div className="text-right">400k</div>,
          <div className="text-right">64,000</div>,
        ],
      ],
    },
  ],
};

const Delegations = () => {
  const navigate = useNavigate();
  return (
    <Container variant="vertical" size="xl" className="py-6">
      <Text variant="body-1-semibold">My Assets</Text>
      <AssetsTable
        onRowClick={() => navigate("accounts")}
        data={MOCK_DATA_NON_SLASHABLE_ASSETS.data}
        tableHeads={MOCK_DATA_NON_SLASHABLE_ASSETS.tableHeads}
      />
      {/*<AssetsTable*/}
      {/*  data={MOCK_DATA_SLASHABLE_ASSETS.data}*/}
      {/*  tableHeads={MOCK_DATA_SLASHABLE_ASSETS.tableHeads}*/}
      {/*/>*/}
    </Container>
  );
};

export default Delegations;
