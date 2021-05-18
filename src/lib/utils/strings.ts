export const longStringShorten = (key: string) => {
  return `${key.substr(0, 10)}...${key.substr(key.length - 10, 10)}`;
};

export const normalizeNumber = (number: number, friction = 2) => {
  return number.toFixed(friction);
};
