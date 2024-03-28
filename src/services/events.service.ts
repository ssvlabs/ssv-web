const CHECK_UPDATES_MAX_ITERATIONS = 60;

const checkIfStateChanged = async (getter: any, valueBefore: any): Promise<boolean> => {
  try {
    const valueAfter = await getter();
    return JSON.stringify(valueBefore) !== JSON.stringify(valueAfter);
  } catch (e) {
    console.error('checkIfStateChanged ', e);
    return false;
  }
};

const delay = async (ms?: number) => (new Promise((r) => setTimeout(() => r(true), ms || 1000)));

export const executeAfterEvent = async ({ updatedStateGetter, prevState, callBack }: { updatedStateGetter: any; prevState?: any; callBack: Function }) => {
  let iterations = 0;
  while (iterations <= CHECK_UPDATES_MAX_ITERATIONS) {
    iterations += 1;
    let res;
    if (prevState) {
      res = await checkIfStateChanged(updatedStateGetter, prevState);
    } else {
      res = await updatedStateGetter();
    }
    if (res) {
      await callBack();
      iterations = CHECK_UPDATES_MAX_ITERATIONS + 1;
    } else {
      await delay();
    }
  }
  return true;
};
