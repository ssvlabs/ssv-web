export interface Keyshares {
  version: string;
  createdAt: string;
  shares: Share[];
}

export interface Share {
  data: Data;
  payload: Payload;
}

export interface Data {
  ownerNonce: number;
  ownerAddress: string;
  publicKey: string;
  operators: Operator[];
}

export interface Operator {
  id: number;
  operatorKey: string;
}

export interface Payload {
  publicKey: string;
  operatorIds: number[];
  sharesData: string;
}
