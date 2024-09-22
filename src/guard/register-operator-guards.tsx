import { createGuard } from "@/guard/create-guard";

export const [RegisterOperatorGuard, useRegisterOperatorContext] = createGuard(
  {
    yearlyFee: 0n,
    publicKey: "",
    isPrivate: false,
  },
  {
    "/join/operator/fee": (state) => {
      if (!state.publicKey) return "/join/operator/register";
    },
    "/join/operator/confirm-transaction": (state) => {
      if (!state.publicKey) return "/join/operator/register";
    },
    "/join/operator/success": (state, { resetState }) => {
      if (!state.publicKey) return "/join/operator/register";
      resetState();
    },
  },
);

export const [UpdateOperatorFeeGuard, useUpdateOperatorFeeContext] =
  createGuard({
    previousYearlyFee: 0n,
    newYearlyFee: 0n,
  });
