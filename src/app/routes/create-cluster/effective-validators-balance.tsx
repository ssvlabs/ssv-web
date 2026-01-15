import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";
import { formatPublicKey } from "@/lib/utils/strings";
import { getValidatorsEffectiveBalance } from "@/api/validators";
import { globals } from "@/config";
import { EffectiveBalanceForm } from "@/components/effective-balance/effective-balance-form";

const EffectiveValidatorsBalance = () => {
  const navigate = useNavigate();
  const registerValidatorContext = useRegisterValidatorContext;
  const { shares, effectiveBalance: savedEffectiveBalance } =
    useRegisterValidatorContext();

  const [validatorBalances, setValidatorBalances] = useState<
    Record<string, number>
  >({});

  const validatorsWithStatus = useMemo(
    () =>
      shares.map((share) => {
        const formattedKey = formatPublicKey(share.publicKey);
        const balance = validatorBalances[formattedKey];
        return {
          publicKey: share.publicKey,
          status:
            balance >= globals.VALIDATOR_FULL_DEPOSIT_VALUE_IN_ETH
              ? ("Deposited" as const)
              : ("Not Deposited" as const),
          effectiveBalance:
            balance ?? globals.VALIDATOR_FULL_DEPOSIT_VALUE_IN_ETH,
        };
      }),
    [shares, validatorBalances],
  );

  useEffect(() => {
    const fetchEffectiveBalances = async () => {
      if (shares.length === 0) return;

      try {
        const publicKeys = shares.map((share) => share.publicKey);
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
  }, [shares]);

  const handleNext = (effectiveBalance: bigint) => {
    registerValidatorContext.state.effectiveBalance = effectiveBalance;
    navigate("../funding");
  };

  return (
    <EffectiveBalanceForm
      validators={validatorsWithStatus}
      onNext={handleNext}
      forceInitialBalance={savedEffectiveBalance}
      backTo="/"
      backPersistSearch
    />
  );
};

export default EffectiveValidatorsBalance;
