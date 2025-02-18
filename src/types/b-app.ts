export enum CreateSteps {
  SelectBApp = 0,
  SetObligations = 1,
  SetFee = 2,
  AddMetadata = 3,
}

export const STEPS_LABELS = {
  [CreateSteps.SelectBApp]: "Select bApp",
  [CreateSteps.SetObligations]: "Set Obligations",
  [CreateSteps.SetFee]: "Set Fee",
  [CreateSteps.AddMetadata]: "Add Metadata",
};
