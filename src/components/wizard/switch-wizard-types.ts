export type SwitchWizardFundingSummary = {
  operatorsPerEth: bigint;
  networkPerEth: bigint;
  liquidationPerEth: bigint;
  operatorsSubtotal: bigint;
  networkSubtotal: bigint;
  liquidationSubtotal: bigint;
};

export type SwitchWizardStepTwoState = {
  effectiveBalance?: bigint;
  from?: string;
};

export type SwitchWizardStepThreeState = {
  fundingDays: number;
  effectiveBalance: bigint;
  fundingSummary?: SwitchWizardFundingSummary;
  totalDeposit?: bigint;
  from?: string;
};
