import { describe, expect, it } from "vitest";

import { roundOperatorFee } from "@/lib/utils/bigint";

describe("util:bigint", () => {
  describe("roundOperatorFee", () => {
    it("leaves already-rounded fees unchanged (multiple of 100_000)", () => {
      const fee = 1_778_800_000n;
      expect(roundOperatorFee(fee)).toBe(fee);
    });

    it("rounds to nearest 100_000 when the fee is not already on that grid", () => {
      expect(roundOperatorFee(1_778_800_200n)).toBe(1_778_800_000n);
    });
  });
});
