
export const conditionalExecutor = async (condition: boolean, functionA: Function, functionB: Function) => condition ? await functionA() : await functionB();

export const formatValidatorPublicKey = (publicKey: string) => publicKey.startsWith('0x') ? publicKey : `0x${publicKey}`;
