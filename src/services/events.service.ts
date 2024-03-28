import config from '~app/common/config';

export const executeAfterEvent = async (condition: Function, callBack: Function, delay: Function) => {
  let iterations = 0;
  while (iterations <= config.GLOBAL_VARIABLE.CHECK_UPDATES_MAX_ITERATIONS) {
    iterations += 1;
    const res = await condition();
    if (res) {
      await callBack();
      iterations = config.GLOBAL_VARIABLE.CHECK_UPDATES_MAX_ITERATIONS + 1;
      continue;
    } else {
      console.log('Transaction still not caught...');
    }
    await delay();
  }
  return true;
};
