import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";
import { formatPublicKey } from "@/lib/utils/strings";
import { getValidatorsEffectiveBalance } from "@/api/validators";
import { globals } from "@/config";
import type { ValidatorItem } from "@/components/effective-balance/effective-balance-form";
import { EffectiveBalanceForm } from "@/components/effective-balance/effective-balance-form";
import { mapValues } from "lodash-es";
import { formatGwei } from "viem";

const EffectiveValidatorsBalance = () => {
  const navigate = useNavigate();
  const registerValidatorContext = useRegisterValidatorContext;
  const { shares, effectiveBalance: savedEffectiveBalance } =
    useRegisterValidatorContext();

  const publicKeys = shares.map((s) => formatPublicKey(s.publicKey));

  const { data: validatorBalances = {} } = useQuery({
    queryKey: ["validators-effective-balance", publicKeys],
    queryFn: async () =>
      getValidatorsEffectiveBalance(publicKeys).then((res) =>
        mapValues(res, (balance) => +formatGwei(BigInt(balance))),
      ),
    enabled: shares.length > 0,
  });

  const validatorsWithStatus = useMemo(
    () =>
      shares.map((share) => {
        const minBalance = globals.MIN_VALIDATOR_EFFECTIVE_BALANCE;
        const balance = validatorBalances[formatPublicKey(share.publicKey)];
        return {
          publicKey: share.publicKey,
          status: balance >= minBalance ? "Deposited" : "Not Deposited",
          effectiveBalance: balance ?? minBalance,
        };
      }) satisfies ValidatorItem[],
    [shares, validatorBalances],
  );

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
