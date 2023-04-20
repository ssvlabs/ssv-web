export const longStringShorten = (value: string, firstFriction: number = 10, secondFriction: number = firstFriction, replacements: Record<string, any> | null = null) => {
  if (!value) return '';
  let str = `${value.substr(0, firstFriction)}...${value.substr(value.length - secondFriction, secondFriction)}`;
  if (replacements) {
      for (let key in replacements) {
           str = str.replace(replacements[key], key);
      }
  }
  return str;
};

export const normalizeNumber = (number: number, friction: number = 2) => {
  return number.toFixed(friction);
};