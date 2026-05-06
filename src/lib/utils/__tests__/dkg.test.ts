import { describe, it, expect } from "vitest";
import { toWithdrawalCredentials } from "@/lib/utils/dkg";

const ADDR = "0xb345fd7d214bB22fAF2d12F67b3a79317A6C40D8" as const;

describe("util:dkg - toWithdrawalCredentials", () => {
  describe("legacy (< 3.1.0)", () => {
    it("returns raw 20-byte address for v3.0.3 regular", () => {
      expect(toWithdrawalCredentials(ADDR, "3.0.3", false)).toBe(ADDR);
    });

    it("returns raw address for older versions like 2.1.0", () => {
      expect(toWithdrawalCredentials(ADDR, "2.1.0", false)).toBe(ADDR);
    });

    it("treats undefined version as legacy", () => {
      expect(toWithdrawalCredentials(ADDR, undefined, false)).toBe(ADDR);
    });

    it("throws when compounding requested on legacy version", () => {
      expect(() => toWithdrawalCredentials(ADDR, "3.0.3", true)).toThrow(
        /Compounding requires DKG version >= 3\.1\.0/,
      );
    });

    it("throws when compounding requested with undefined version", () => {
      expect(() => toWithdrawalCredentials(ADDR, undefined, true)).toThrow();
    });
  });

  describe(">= 3.1.0 regular (0x01 prefix)", () => {
    it("emits full 32-byte 0x01-prefixed credentials for v3.1.0", () => {
      expect(toWithdrawalCredentials(ADDR, "3.1.0", false)).toBe(
        "0x010000000000000000000000b345fd7d214bb22faf2d12f67b3a79317a6c40d8",
      );
    });

    it("matches the format ssv-dkg v3.1.0 logs as 'withdrawal'", () => {
      // From real docker output: "withdrawal":"010000000000000000000000b345fd7d..."
      const result = toWithdrawalCredentials(ADDR, "3.1.0", false);
      expect(result.slice(2, 4)).toBe("01");
      expect(result.slice(4, 26)).toBe("0".repeat(22));
      expect(result.slice(26)).toBe(ADDR.slice(2).toLowerCase());
    });

    it("works for higher versions like 3.2.0", () => {
      expect(toWithdrawalCredentials(ADDR, "3.2.0", false)).toBe(
        "0x010000000000000000000000b345fd7d214bb22faf2d12f67b3a79317a6c40d8",
      );
    });

    it("strips the v prefix from the version string", () => {
      expect(toWithdrawalCredentials(ADDR, "v3.1.0", false)).toBe(
        "0x010000000000000000000000b345fd7d214bb22faf2d12f67b3a79317a6c40d8",
      );
    });
  });

  describe(">= 3.1.0 compounding (0x02 prefix)", () => {
    it("emits full 32-byte 0x02-prefixed credentials", () => {
      expect(toWithdrawalCredentials(ADDR, "3.1.0", true)).toBe(
        "0x020000000000000000000000b345fd7d214bb22faf2d12f67b3a79317a6c40d8",
      );
    });

    it("differs from regular only in the prefix byte", () => {
      const regular = toWithdrawalCredentials(ADDR, "3.1.0", false);
      const compounding = toWithdrawalCredentials(ADDR, "3.1.0", true);
      expect(regular.slice(4)).toBe(compounding.slice(4));
      expect(regular.slice(2, 4)).toBe("01");
      expect(compounding.slice(2, 4)).toBe("02");
    });
  });

  describe("output shape", () => {
    it("returns exactly 32 bytes (66 chars w/ 0x) on >= 3.1.0", () => {
      const result = toWithdrawalCredentials(ADDR, "3.1.0", false);
      expect(result.length).toBe(66);
    });

    it("lowercases the address portion in the 32-byte form", () => {
      const result = toWithdrawalCredentials(ADDR, "3.1.0", false);
      expect(result).toBe(result.toLowerCase());
    });
  });
});
