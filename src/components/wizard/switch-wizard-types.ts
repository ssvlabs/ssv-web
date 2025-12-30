export type SwitchWizardFundingSummary = {
  operatorsPerEth: bigint;
  networkPerEth: bigint;
  liquidationPerEth: bigint;
  operatorsSubtotal: bigint;
  networkSubtotal: bigint;
  liquidationSubtotal: bigint;
};

export type SwitchWizardStepThreeState = {
  fundingDays: number;
  effectiveBalance: bigint;
  fundingSummary?: SwitchWizardFundingSummary;
  totalDeposit?: bigint;
};
