export const longStringShorten = (value: string, firstFriction: number = 10, secondFriction: number = firstFriction, replacements: Record<string, any> | null = null) => {
  if (!value) return '';
  if (replacements) {
        for (let key in replacements) {
            value = value.replace(replacements[key], key);
        }
    }
  let str = `${value.substr(0, firstFriction)}...${value.substr(value.length - secondFriction, secondFriction)}`;

  return str;
};

export const normalizeNumber = (number: number, friction: number = 2) => {
  return number.toFixed(friction);
};