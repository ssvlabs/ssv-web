import type { RefObject } from "react";
import { useKey } from "react-use";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};
export const useArrowIncrement = (
  ref: RefObject<HTMLElement>,
  {
    value,
    onChange,
    min = -Infinity,
    max = Infinity,
    step: defaultStep = 1,
  }: Props,
) => {
  const handleArrowKey =
    (direction: "up" | "down") => (event: KeyboardEvent) => {
      const step = defaultStep * (event.shiftKey ? 10 : 1);
      const nextValue = value + step * (direction === "up" ? 1 : -1);
      return onChange(Math.min(Math.max(nextValue, min), max));
    };

  useKey(
    "ArrowUp",
    handleArrowKey("up"),
    {
      target: ref.current,
    },
    [onChange],
  );
  useKey(
    "ArrowDown",
    handleArrowKey("down"),
    {
      target: ref.current,
    },
    [onChange],
  );
};
