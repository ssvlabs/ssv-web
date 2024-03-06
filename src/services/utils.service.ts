
const checkEntityChangedInAccount = async (getter: any, valueBefore: any): Promise<boolean> => {
  try {
    const valueAfter = await getter();
    return JSON.stringify(valueBefore) !== JSON.stringify(valueAfter);
  } catch (e) {
    console.error('checkEntityChangedInAccount ', e);
    return false;
  }
};

const delay = async (ms?: number) => (new Promise((r) => setTimeout(() => r(true), ms || 1000)));


export { checkEntityChangedInAccount, delay };
