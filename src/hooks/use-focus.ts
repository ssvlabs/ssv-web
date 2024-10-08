import { useEffectOnce } from "react-use";

export const useFocus = (
  selectorOrElement: string | HTMLElement,
  opts: { select?: boolean } = {},
) => {
  useEffectOnce(() => {
    const element =
      selectorOrElement instanceof HTMLElement
        ? selectorOrElement
        : (document.querySelector(selectorOrElement) as HTMLElement | null);
    element?.focus();
    opts.select && element instanceof HTMLInputElement && element?.select();
  });
};
