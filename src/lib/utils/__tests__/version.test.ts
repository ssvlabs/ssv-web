import { describe, it, expect } from "vitest";
import {
  parseVersion,
  isVersionLT,
  withMinDkgVersionFlags,
} from "@/lib/utils/version";

// Kept in sync with `DKG_VERSIONS.MIN_VERSION_FOR_ADDRESS` by hand: importing
// from `keyshares` pulls in the wagmi chain config, which needs a built
// VITE_SSV_NETWORKS at import time.
const MIN = "3.1.1";

describe("util:version", () => {
  describe("parseVersion", () => {
    // ssv-api returns the node's version verbatim from the SSZ health_check
    // payload, and DKG nodes report it *with* a leading "v" ("v3.1.1"). A naive
    // string compare would mask every operator, so the prefix is load-bearing.
    it("strips a leading v", () => {
      expect(parseVersion("v3.1.1")).toEqual([3, 1, 1]);
      expect(parseVersion("V3.1.1")).toEqual([3, 1, 1]);
    });

    it("ignores pre-release and build suffixes", () => {
      expect(parseVersion("3.1.1-rc.1")).toEqual([3, 1, 1]);
      expect(parseVersion("v3.1.1+build.4")).toEqual([3, 1, 1]);
    });

    it("is total — never throws on junk", () => {
      expect(parseVersion(undefined)).toEqual([0, 0, 0]);
      expect(parseVersion(null)).toEqual([0, 0, 0]);
      expect(parseVersion("")).toEqual([0, 0, 0]);
      expect(parseVersion("not-a-version")).toEqual([0, 0, 0]);
      expect(parseVersion("3.1")).toEqual([3, 1, 0]);
    });
  });

  describe("isVersionLT — the DKG address gate", () => {
    // Versions below are the ones actually reported by mainnet DKG nodes.
    it("does not flag a node at the threshold", () => {
      expect(isVersionLT("v3.1.1", MIN)).toBe(false);
    });

    it("does not flag a node above the threshold", () => {
      expect(isVersionLT("v3.1.2", MIN)).toBe(false);
      expect(isVersionLT("v3.2.0", MIN)).toBe(false);
      expect(isVersionLT("v4.0.0", MIN)).toBe(false);
    });

    it("flags a node below the threshold", () => {
      expect(isVersionLT("v3.1.0", MIN)).toBe(true);
      expect(isVersionLT("v3.0.3", MIN)).toBe(true);
      expect(isVersionLT("v2.1.0", MIN)).toBe(true);
    });

    it("compares numerically, not lexically", () => {
      expect(isVersionLT("3.9.0", "3.10.0")).toBe(true);
      expect(isVersionLT("3.10.0", "3.9.0")).toBe(false);
    });

    // A node that never answered has version null. It is already blocked by
    // `isHealthy: false` (see ssv-api `buildFailedDkgHealthStatus`), so it must
    // not *also* be reported as below-version — that would mislabel an offline
    // node as an outdated one in the unhealthy-operators list.
    it("does not flag a node that reported no version", () => {
      expect(isVersionLT(null, MIN)).toBe(false);
      expect(isVersionLT(undefined, MIN)).toBe(false);
      expect(isVersionLT("", MIN)).toBe(false);
    });
  });

  describe("withMinDkgVersionFlags", () => {
    const answered = { isHealthy: true, isOutdated: false };
    const flags = (health: Parameters<typeof withMinDkgVersionFlags>[0]) =>
      withMinDkgVersionFlags(health, MIN);
    const PASSES = {
      isBelowMinVersionForAddress: false,
      isVersionUnknown: false,
    };
    const BELOW = {
      isBelowMinVersionForAddress: true,
      isVersionUnknown: false,
    };
    const UNKNOWN = {
      isBelowMinVersionForAddress: true,
      isVersionUnknown: true,
    };

    it("keeps the health-check fields", () => {
      const health = {
        id: "1",
        isMismatchId: false,
        ...answered,
        version: "v3.1.1",
      };
      expect(flags(health)).toEqual({ ...health, ...PASSES });
    });

    it("compares the version of a node that answered", () => {
      expect(flags({ ...answered, version: "v3.1.1" })).toMatchObject(PASSES);
      expect(flags({ ...answered, version: "v3.2.0" })).toMatchObject(PASSES);
      expect(flags({ ...answered, version: "v3.0.3" })).toMatchObject(BELOW);
    });

    // Once ssv-api validates versions, it returns `version: null` for a
    // malformed one ("dev", "3.1.1;id"). The field comes from JSON, so a
    // non-string must be flagged too, not thrown on.
    it.each([null, undefined, "", 311, {}])(
      "flags a node that answered with version %j as unknown",
      (version) => {
        expect(flags({ ...answered, version })).toMatchObject(UNKNOWN);
      },
    );

    // ssv-api couldn't decode the answer; the node keeps `isHealthy: true`.
    // Flagged by `isOutdated` alone, whatever the version says.
    it.each([null, "v3.2.0"])(
      "flags an outdated node with version %j",
      (version) => {
        expect(
          flags({ isHealthy: true, isOutdated: true, version }),
        ).toMatchObject(BELOW);
      },
    );

    // Blocked as unhealthy already; flagging it would show it as outdated
    // instead of disabled.
    it("does not flag an unhealthy node without a version", () => {
      expect(
        flags({ isHealthy: false, isOutdated: false, version: null }),
      ).toMatchObject(PASSES);
    });

    it("still compares a reported version when the node is unhealthy", () => {
      expect(
        flags({ isHealthy: false, isOutdated: false, version: "v3.0.3" }),
      ).toMatchObject(BELOW);
    });
  });
});
