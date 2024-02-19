import { Process } from '~app/common/stores/applications/SsvWeb/processes/BaseProcess';

interface RegisterValidator {
  depositAmount: number;
}

export enum BULK_FLOWS  {
  BULK_REMOVE = 'BULK_REMOVE',
  BULK_EXIT = 'BULK_EXIT',
}

export interface SingleCluster extends Process {
  item?: any,
  currentBulkFlow?: BULK_FLOWS;
  operators?: any;
  validator?: any;
  registerValidator?: RegisterValidator;
}
