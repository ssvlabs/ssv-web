import { ValidatorStatuses } from '~app/components/applications/SSV/enums';

interface KeyShareItem {
  ownerNonce: string;
  ownerAddress: string;
  publicKey: string;
  operators: { id: number; operatorKey: string; }[];
}

interface Validator {
  publicKey: string;
  status: ValidatorStatuses;
}

export { KeyShareItem, Validator };
