import * as React from "react";

import { cn } from "@/lib/utils/tw";

const stripedGradient = (base: string, stripe: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="p" patternUnits="userSpaceOnUse" width="4.5" height="4.5" patternTransform="rotate(18)"><line x1="0" y1="0" x2="0" y2="4.5" stroke="${stripe}" stroke-width="3"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}"), ${base}`;
};

export const STRIPED_BAR_VARIANTS = [
  "active",
  "inactive",
  "invalid",
  "depositing",
  "notDeposited",
  "exiting",
  "exited",
  "slashed",
] as const;

export type StripedBarVariant = (typeof STRIPED_BAR_VARIANTS)[number];

const VARIANT_STYLES: Record<StripedBarVariant, React.CSSProperties> = {
  active: {
    background: "var(--success-500)",
    border: "1px solid var(--success-700)",
  },
  inactive: {
    background: stripedGradient("#83e3ab", "#b88069"),
    border: "1px solid var(--error-500)",
    transform: "translateZ(0)",
  },
  invalid: {
    background: stripedGradient("#83e3ab", "#b88069"),
    border: "1px solid var(--error-500)",
    transform: "translateZ(0)",
  },
  depositing: {
    background: stripedGradient(
      "rgba(8, 200, 88, 0.16)",
      "rgba(6, 182, 79, 0.4)",
    ),
    border: "1px solid var(--success-700)",
    transform: "translateZ(0)",
  },
  notDeposited: {
    background: "rgba(151, 165, 186, 0.5)",
    border: "1px solid #97a5ba",
  },
  exiting: {
    background: stripedGradient(
      "rgba(208, 153, 253, 0.24)",
      "rgba(192, 112, 255, 0.5)",
    ),
    border: "1px solid #c070ff",
    transform: "translateZ(0)",
  },
  exited: {
    background: "#d099fd",
    border: "1px solid #c070ff",
  },
  slashed: {
    background: stripedGradient("#f06cab", "#ec1c26"),
    border: "1px solid rgba(232, 18, 119, 0.8)",
    transform: "translateZ(0)",
  },
};

export interface StripedBarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: StripedBarVariant;
}

export const StripedBar = React.forwardRef<HTMLDivElement, StripedBarProps>(
  ({ className, variant, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-[2px] shrink-0", className)}
      style={{
        minWidth: 8,
        minHeight: 8,
        ...VARIANT_STYLES[variant],
        ...style,
      }}
      {...props}
    />
  ),
);

StripedBar.displayName = "StripedBar";
