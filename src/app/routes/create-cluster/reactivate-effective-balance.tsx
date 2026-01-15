import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { formatPublicKey } from "@/lib/utils/strings";
import { getValidatorsEffectiveBalance } from "@/api/validators";
import { globals } from "@/config";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useInfiniteClusterValidators } from "@/hooks/cluster/use-infinite-cluster-validators";
import { Loading } from "@/components/ui/Loading";
import { EffectiveBalanceForm } from "@/components/effective-balance/effective-balance-form";

const ReactivateEffectiveBalance = () => {
  const navigate = useNavigate();
  const { clusterHash } = useClusterPageParams();
  const { validators, infiniteQuery } =
    useInfiniteClusterValidators(clusterHash);

  const [validatorBalances, setValidatorBalances] = useState<
    Record<string, number>
  >({});

  const validatorsWithStatus = useMemo(
    () =>
      validators.map((validator) => {
        const formattedKey = formatPublicKey(validator.public_key);
        const balance = validatorBalances[formattedKey];
        return {
          publicKey: validator.public_key,
          status:
            balance >= globals.VALIDATOR_FULL_DEPOSIT_VALUE_IN_ETH
              ? ("Deposited" as const)
              : ("Not Deposited" as const),
          effectiveBalance:
            balance ?? globals.VALIDATOR_FULL_DEPOSIT_VALUE_IN_ETH,
        };
      }),
    [validators, validatorBalances],
  );

  useEffect(() => {
    const fetchEffectiveBalances = async () => {
      if (validators.length === 0) return;

      try {
        const publicKeys = validators.map((validator) => validator.public_key);
        const response = await getValidatorsEffectiveBalance(publicKeys);

        const balanceMap: Record<string, number> = {};

        // Check if response has validators array or is a direct map
        if ("validators" in response && Array.isArray(response.validators)) {
          response.validators.forEach((validator) => {
            const formattedKey = formatPublicKey(validator.publicKey);
            balanceMap[formattedKey] = validator.effectiveBalance;
          });
        } else {
          // Response is a direct map of {publicKey: balance}
          Object.entries(response).forEach(([publicKey, balance]) => {
            const formattedKey = formatPublicKey(publicKey);
            // Convert from Gwei to ETH
            const balanceInEth = (balance as number) / 1_000_000_000;
            balanceMap[formattedKey] = balanceInEth;
          });
        }

        setValidatorBalances(balanceMap);
      } catch (error) {
        console.error("Failed to fetch effective balances:", error);
      }
    };

    fetchEffectiveBalances();
  }, [validators]);

  const handleNext = (effectiveBalance: bigint) => {
    navigate("../reactivate", {
      state: {
        effectiveBalance,
      },
    });
  };

  if (infiniteQuery.isPending) return <Loading />;

  return (
    <EffectiveBalanceForm
      clusterHash={clusterHash}
      validators={validatorsWithStatus}
      onNext={handleNext}
      backTo=".."
    />
  );
};

export default ReactivateEffectiveBalance;
