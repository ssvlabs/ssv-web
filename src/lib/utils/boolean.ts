export const boolify = (...values: (unknown | undefined)[]): boolean => {
  return values.every(Boolean);
};
