export const isBrowser = () => {
  return typeof window === 'undefined';
};

export const isNode = () => {
  return typeof process === 'object';
};
