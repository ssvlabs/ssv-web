export const longStringShorten = (key: string, friction: number = 10) => {
  return `${key.substr(0, friction)}...${key.substr(key.length - friction, friction)}`;
};

export const normalizeNumber = (number: number, friction: number = 2) => {
  return number.toFixed(friction);
};

export const moveIndex = (arr: any, fromIndex: number, toIndex: number) => {
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
};
