
type ClusterDataType = {
  active: boolean;
  balance: number;
  index: number;
  networkFeeIndex: number;
  validatorCount: number;
};

const createPayload = (publicKey: string | string[], operatorIds: number[] | number[][], sharesData: string | string[], totalCost: string | string[], clusterData: ClusterDataType) => {
  const payload = new Map<string, any>();
  payload.set('keyStorePublicKey', publicKey);
  payload.set('operatorIds', operatorIds);
  payload.set('sharesData', sharesData);
  payload.set('totalCost', `${totalCost}`);
  payload.set('clusterData', clusterData);
  return payload;
};

const isJsonFile = (file: any): boolean => {
  return file?.type === 'application/json';
};

export { createPayload, isJsonFile };
