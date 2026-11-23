export const normalizeVersion = (v: string): string => v.replace(/^v/i, "");

/**
 * Semver-ish parse for versions reported by SSV DKG nodes, which may be
 * prefixed ("v3.1.1") and/or carry a pre-release or build suffix
 * ("3.1.1-rc.1", "3.1.1+build.4").
 */
export const parseVersion = (
  v: string | undefined | null,
): [number, number, number] => {
  if (!v) return [0, 0, 0];
  const cleaned = normalizeVersion(v).split(/[-+]/)[0];
  const parts = cleaned.split(".").map((n) => parseInt(n, 10));
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
};

/** `false` for a missing version — an absent version is never "older than". */
export const isVersionLT = (
  v: string | undefined | null,
  target: string,
): boolean => {
  if (!v) return false;
  const [a, b, c] = parseVersion(v);
  const [x, y, z] = parseVersion(target);
  if (a !== x) return a < x;
  if (b !== y) return b < y;
  return c < z;
};

/**
 * TEMPORARY, for the DKG version gate. Adds to a DKG health-check result:
 *
 * - `isBelowMinVersionForAddress`: the node can't be shown to run `minVersion`
 *   or newer. It reported an older version, or it answered without a usable
 *   one: ssv-api returns `version: null` for a malformed version and for an
 *   answer it couldn't decode (`isOutdated`, which keeps `isHealthy: true`).
 *   A node with `isHealthy: false` and no version is left unflagged: it is
 *   blocked as unhealthy already, and flagging it would show it as outdated
 *   instead of disabled.
 * - `isVersionUnknown`: the node answered readably and with its own ID, but
 *   without a usable version.
 */
export const withMinDkgVersionFlags = <
  T extends { isHealthy: boolean; isOutdated: boolean; version?: unknown },
>(
  health: T,
  minVersion: string,
) => {
  // `version` comes from JSON, so its type isn't enforced at run time.
  const version = typeof health.version === "string" ? health.version : "";
  return {
    ...health,
    isBelowMinVersionForAddress: version
      ? isVersionLT(version, minVersion)
      : health.isHealthy,
    isVersionUnknown: !version && health.isHealthy && !health.isOutdated,
  };
};
