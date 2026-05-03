export const normalizeVersion = (v: string): string => {
  return v.replace(/^v/i, "");
};

export const parseVersion = (
  v: string | undefined,
): [number, number, number] => {
  if (!v) return [0, 0, 0];
  const cleaned = normalizeVersion(v).split(/[-+]/)[0];
  const parts = cleaned.split(".").map((n) => parseInt(n, 10));
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
};

export const isVersionGTE = (
  v: string | undefined,
  target: string,
): boolean => {
  if (!v) return false;
  const [a, b, c] = parseVersion(v);
  const [x, y, z] = parseVersion(target);
  if (a !== x) return a > x;
  if (b !== y) return b > y;
  return c >= z;
};

export const isVersionLTE = (
  v: string | undefined,
  target: string,
): boolean => {
  if (!v) return false;
  const [a, b, c] = parseVersion(v);
  const [x, y, z] = parseVersion(target);
  if (a !== x) return a < x;
  if (b !== y) return b < y;
  return c <= z;
};
