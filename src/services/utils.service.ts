
export const conditionalExecutor = async (condition: boolean, functionA: Function, functionB: Function) => condition ? await functionA() : await functionB();
