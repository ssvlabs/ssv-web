import { Text } from "@/components/ui/text.tsx";
import AssetsTable from "@/app/routes/dashboard/b-app/my-account/assets-table.tsx";
import { Container } from "@/components/ui/container.tsx";
import { useNavigate } from "react-router-dom";
import { useMyBAppAccount } from "@/hooks/b-app/use-my-b-app-account.ts";
import {
  convertToPercentage,
  ethFormatter,
  formatSSV,
  percentageFormatter,
} from "@/lib/utils/number.ts";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { formatUnits } from "viem";

const createValidatorBalanceRow = ({
  delegationsCount = 0,
  effectiveBalance = 0n,
  totalDelegatedValue,
}: {
  delegationsCount: number;
  effectiveBalance: bigint;
  totalDelegatedValue: number;
}) => {
  return {
    hasInnerTable: true,
    rows: [
      <div className="flex gap-2 w-[c320px]">
        <img
          className={"h-[24px] w-[15px]"}
          src={`/images/balance-validator/balance-validator.svg`}
        />
        Validator Balance
        <Text className="text-gray-500 font-medium">ETH</Text>
      </div>,
      formatSSV(effectiveBalance, 9),
      <div className="w-7 h-6 rounded-[4px] bg-primary-100 border border-primary-500 text-primary-500 flex items-center justify-center text-[10px]">
        {delegationsCount}
      </div>,
      totalDelegatedValue,
      "0",
    ],
  };
};

const createInnerRow = (
  delegations: {
    percentage: string;
    receiver: { id: string };
  }[],
  effectiveBalance: bigint,
) => {
  return delegations.map(
    (delegation: { percentage: string; receiver: { id: string } }) => {
      const percentage = convertToPercentage(delegation.percentage);
      const delegated = Math.round(
        ((percentage || 0) / 100) * Number(effectiveBalance || 0n),
      );
      return [
        <div className="flex items-center gap-2 m-0 p-0">
          <img
            className="rounded-[8px] size-7 border-gray-400 border"
            src={"/images/operator_default_background/light.svg"}
          />
          {shortenAddress(delegation.receiver.id)}
        </div>,
        percentageFormatter.format(convertToPercentage(delegation.percentage)),
        "",
        <div className="text-right">
          {Math.floor(
            Number(
              ethFormatter.format(+formatUnits(BigInt(delegated || 0n), 9)),
            ) * 100,
          ) / 100}
        </div>,
        <div className="text-right">$ 38.1k</div>,
      ];
    },
  );
};

enum Asset {
  Slashable = "Slashable",
  NonSlashable = "NonSlashable",
}

const headersToMap = {
  name: {
    [Asset.Slashable]: "Assets",
    [Asset.NonSlashable]: "Validator Balance",
  },
  balance: {
    [Asset.Slashable]: "Wallet Balance",
    [Asset.NonSlashable]: "SSV Balance",
  },
  accounts: {
    [Asset.Slashable]: "Delegated Strategies",
    [Asset.NonSlashable]: "Delegated Accounts",
  },
};

const nonSlashableAssetsHeads = (asset: Asset) => [
  {
    label: headersToMap.name[asset],
    textAlign: "w-[348px]",
    size: 348,
  },
  {
    label: headersToMap.balance[asset],
    textAlign: "w-[200px]",
    size: 200,
  },
  {
    label: headersToMap.accounts[asset],
    textAlign: "flex items-center justify-end w-[240px]",
    size: 240,
  },
  {
    label: "Delegated",
    size: 240,
    textAlign: "text-right w-[240px]",
    extendedClass: "flex flex-end items-center bg-red",
  },
  {
    label: "Total Delegated Value",
    textAlign: "text-right w-[240px]",
    size: 240,
  },
  {
    label: "",
    textAlign: "text-right",
    size: 52,
  },
];

const Delegations = () => {
  const navigate = useNavigate();
  const { data, totalDelegatedValue, effectiveBalance, isLoading } =
    useMyBAppAccount();

  const validatorBalanceRow = createValidatorBalanceRow(
    ({
      delegationsCount: data?.delegations.length,
      effectiveBalance: data?.effectiveBalance,
      totalDelegatedValue,
    } || {
      delegations: [],
      effectiveBalance: 0n,
      totalDelegatedValue: 0,
    }) as {
      delegationsCount: number;
      effectiveBalance: bigint;
      totalDelegatedValue: number;
    },
  );
  const innerData = createInnerRow(
    data?.delegations || [],
    effectiveBalance || 0n,
  );
  return (
    <Container variant="vertical" size="xl" className="py-6">
      <Text variant="body-1-semibold">My Assets</Text>
      <AssetsTable
        onRowClick={() => navigate("accounts")}
        data={[{ ...validatorBalanceRow, innerData }]}
        isLoading={isLoading}
        tableHeads={nonSlashableAssetsHeads(Asset.NonSlashable)}
      />
      <AssetsTable
        onRowClick={() => navigate("accounts")}
        data={[]}
        tableHeads={nonSlashableAssetsHeads(Asset.Slashable)}
      />
    </Container>
  );
};

export default Delegations;
