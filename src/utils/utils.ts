type PromiseResult<T> = [Error | null, T] | [Error];

async function exec<T>(promise: Promise<T>): Promise<PromiseResult<T>> {
  try {
    const data = await promise;
    return [null, data] as PromiseResult<T>;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return [error];
    } else {
      throw new Error('An unknown error occurred.');
    }
  }
}

export default exec;
