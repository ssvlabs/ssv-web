import { describe, it, expect } from "vitest";
import { isVersionGTE, isVersionLTE, parseVersion } from "@/lib/utils/version";

describe("util:version", () => {
  describe("parseVersion", () => {
    it("parses standard semver", () => {
      expect(parseVersion("3.1.0")).toEqual([3, 1, 0]);
    });

    it("strips leading v prefix", () => {
      expect(parseVersion("v3.1.0")).toEqual([3, 1, 0]);
      expect(parseVersion("V3.1.0")).toEqual([3, 1, 0]);
    });

    it("strips pre-release suffix", () => {
      expect(parseVersion("3.1.0-beta")).toEqual([3, 1, 0]);
      expect(parseVersion("3.1.0-rc.1")).toEqual([3, 1, 0]);
      expect(parseVersion("3.1.0+build.5")).toEqual([3, 1, 0]);
    });

    it("returns zeros for undefined or empty", () => {
      expect(parseVersion(undefined)).toEqual([0, 0, 0]);
      expect(parseVersion("")).toEqual([0, 0, 0]);
    });

    it("handles missing patch / minor", () => {
      expect(parseVersion("3.1")).toEqual([3, 1, 0]);
      expect(parseVersion("3")).toEqual([3, 0, 0]);
    });

    it("parses multi-digit segments numerically", () => {
      expect(parseVersion("3.10.0")).toEqual([3, 10, 0]);
      expect(parseVersion("12.34.56")).toEqual([12, 34, 56]);
    });
  });

  describe("isVersionGTE", () => {
    const TARGET = "3.1.0";

    it("returns false for undefined", () => {
      expect(isVersionGTE(undefined, TARGET)).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isVersionGTE("", TARGET)).toBe(false);
    });

    it("returns true for equal versions", () => {
      expect(isVersionGTE("3.1.0", TARGET)).toBe(true);
    });

    it("returns true for higher major", () => {
      expect(isVersionGTE("4.0.0", TARGET)).toBe(true);
    });

    it("returns false for lower major", () => {
      expect(isVersionGTE("2.99.99", TARGET)).toBe(false);
    });

    it("returns false for same major but lower minor", () => {
      expect(isVersionGTE("3.0.5", TARGET)).toBe(false);
      expect(isVersionGTE("3.0.99", TARGET)).toBe(false);
    });

    it("returns true for same major but higher minor", () => {
      expect(isVersionGTE("3.2.0", TARGET)).toBe(true);
    });

    it("returns true for same major and minor but higher patch", () => {
      expect(isVersionGTE("3.1.5", TARGET)).toBe(true);
    });

    it("returns false for same major and minor but lower patch", () => {
      expect(isVersionGTE("3.1.0", "3.1.5")).toBe(false);
    });

    it("compares multi-digit minor numerically (string compare would fail)", () => {
      expect(isVersionGTE("3.10.0", "3.2.0")).toBe(true);
      expect(isVersionGTE("3.9.0", "3.10.0")).toBe(false);
    });

    it("tolerates v prefix", () => {
      expect(isVersionGTE("v3.1.0", TARGET)).toBe(true);
    });

    it("tolerates pre-release suffix", () => {
      expect(isVersionGTE("3.1.0-beta", TARGET)).toBe(true);
      expect(isVersionGTE("3.0.9-rc.1", TARGET)).toBe(false);
    });
  });

  describe("isVersionLTE", () => {
    const TARGET = "3.1.0";

    it("returns false for undefined", () => {
      expect(isVersionLTE(undefined, TARGET)).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isVersionLTE("", TARGET)).toBe(false);
    });

    it("returns true for equal versions", () => {
      expect(isVersionLTE("3.1.0", TARGET)).toBe(true);
    });

    it("returns false for higher major", () => {
      expect(isVersionLTE("4.0.0", TARGET)).toBe(false);
    });

    it("returns true for lower major", () => {
      expect(isVersionLTE("2.99.99", TARGET)).toBe(true);
    });

    it("returns true for same major but lower minor", () => {
      expect(isVersionLTE("3.0.5", TARGET)).toBe(true);
      expect(isVersionLTE("3.0.99", TARGET)).toBe(true);
    });

    it("returns false for same major but higher minor", () => {
      expect(isVersionLTE("3.2.0", TARGET)).toBe(false);
    });

    it("returns false for same major and minor but higher patch", () => {
      expect(isVersionLTE("3.1.5", TARGET)).toBe(false);
    });

    it("returns true for same major and minor but lower patch", () => {
      expect(isVersionLTE("3.1.0", "3.1.5")).toBe(true);
    });

    it("compares multi-digit minor numerically (string compare would fail)", () => {
      expect(isVersionLTE("3.2.0", "3.10.0")).toBe(true);
      expect(isVersionLTE("3.10.0", "3.9.0")).toBe(false);
    });

    it("tolerates v prefix", () => {
      expect(isVersionLTE("v3.1.0", TARGET)).toBe(true);
    });

    it("tolerates pre-release suffix", () => {
      expect(isVersionLTE("3.1.0-beta", TARGET)).toBe(true);
      expect(isVersionLTE("3.1.1-rc.1", TARGET)).toBe(false);
    });
  });
});
