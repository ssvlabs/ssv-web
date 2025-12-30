export type SwitchWizardFundingSummary = {
  operatorsPerEth: number;
  networkPerEth: number;
  liquidationPerEth: number;
  operatorsSubtotal: number;
  networkSubtotal: number;
  liquidationSubtotal: number;
};

export type SwitchWizardStepThreeState = {
  fundingDays: number;
  effectiveBalance: number;
  fundingSummary?: SwitchWizardFundingSummary;
  totalDeposit?: number;
};
