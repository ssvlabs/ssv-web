/**
 * Get maximum precision of float number.
 * @param numeric
 */
export const getPrecision = (numeric: number | string) => {
  let precision = 0;
  try {
    const numberParts = String(numeric).split(/[-+]/gi);
    if (numberParts.length < 2) {
      throw Error('Not scientific format');
    }
    precision = parseInt(numberParts[1], 10);
    precision += numberParts[0].replace(/[e.]/gi, '').length;
  } catch {
    if (!precision) {
      try {
        const numberParts = String(numeric).split('.');
        precision = numberParts[1].length + 1;
      } catch (error) {
        //
      }
    }
  }
  return precision;
};

/**
 * Format float number to maximum precision unlike regular floats does.
 * @param numeric
 */
export const formatFloatToMaxPrecision = (numeric: number | string) => {
  const floatNum = parseFloat(String(numeric));
  if (Number.isNaN(floatNum)) {
    return '0.0';
  }
  let floatString = floatNum.toFixed(getPrecision(numeric));
  if (floatString.endsWith('.0') || floatString.split('.').length < 2) {
    return floatString;
  }
  floatString = floatString.replace(/(0)+$/gi, '');
  if (floatString.endsWith('.')) {
    floatString = floatString.replace('.', '');
  }
  return floatString;
};
