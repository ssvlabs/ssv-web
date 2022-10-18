export const longStringShorten = (key: string, firstFriction: number = 10, secondFriction: number = firstFriction) => {
  if (!key) return '';
  return `${key.substr(0, firstFriction)}...${key.substr(key.length - secondFriction, secondFriction)}`;
};

export const normalizeNumber = (number: number, friction: number = 2) => {
  return number.toFixed(friction);
};