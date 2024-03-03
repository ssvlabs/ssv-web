const wait = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

interface RetryWithDelayOptions {
  caller: () => Promise<any>;
  maxAttempts: number;
  backOff: number;
  exponentialOption: {
    maxInterval: number,
    multiplier: number
  };
}

const retryWithDelay = async ({ caller, maxAttempts, backOff, exponentialOption }: RetryWithDelayOptions): Promise<any> => {
  try {
    await caller();
  } catch (err: any) {
    console.error(`Error: ${err.message || err.stack || err}. Retrying..`);
    if (maxAttempts <= 0) {
      return Promise.reject();
    }
    await wait(backOff);
    const incrementedBackOff = Math.min(backOff * exponentialOption.multiplier,  exponentialOption.maxInterval);
    return retryWithDelay({ caller, maxAttempts: (maxAttempts - 1), backOff: incrementedBackOff, exponentialOption });
  }
};


export { retryWithDelay };
