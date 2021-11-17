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

export const roundNumber = (num: number, rlength: number) => {
  // eslint-disable-next-line no-restricted-properties
  return Math.round(num * Math.pow(10, rlength)) / Math.pow(10, rlength);
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

export const formatNumberToUi = (num: number) => {
  if (!num) return;
  const splitNumber = num.toString().split('.');
  if (num < 1) {
    const number = splitNumber[0];
    let decimal = splitNumber[1];
    let deleteFromIndex = 0;
    let shouldContinue = true;
    // let showDecimal = true;
    let indexLoop = 0;
    // @ts-ignore
    while (deleteFromIndex === 0 || shouldContinue) {
      // if (indexLoop === 0 && decimal[indexLoop] === '0') {
      //   showDecimal = false;
      //   shouldContinue = false;
      // }
      if (decimal[indexLoop] !== '0') {
        deleteFromIndex = indexLoop;
        shouldContinue = false;
      } else {
        indexLoop += 1;
      }
    }
    // if (!showDecimal) {
    //   return `${number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
    // }
    decimal = decimal.slice(0, deleteFromIndex + 2);
    return `${number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}.${decimal}`;
  } if (!splitNumber[1]) {
    return `${splitNumber[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
  } 
    return `${num.toFixed(2).replace(/0+$/, '').toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
};

export const roundCryptoValueString = (desiredNumber: number, decimalPlaces: number = 18) => {
  const arr = desiredNumber.toString().split('.');
  const fraction = arr[1].substr(0, decimalPlaces);
  return `${arr[0]}.${fraction}`;
};