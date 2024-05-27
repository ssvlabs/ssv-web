import { IOperator } from '~app/model/operator.model.ts';
import { ICluster } from '~app/model/cluster.model.ts';

interface Validator {
  publicKey: string;
  public_key: string; // TODO: Both properties are used - which one is valid?
  operators: { id: number; operatorKey: string }[]; //IOperator[];
}

interface SingleOperator {
  processName: string;
  item?: IOperator;
}

export type ValidatorItem = Validator & ICluster;

interface SingleCluster {
  processName: string;
  item?: ValidatorItem;
  currentBulkFlow?: BULK_FLOWS;
  operators?: any;
  validator?: any;
  registerValidator?: RegisterValidator;
}

interface RegisterValidator {
  depositAmount: number;
}

interface RegisterOperator {
  processName: string;
  item?: IOperator;
}

enum BULK_FLOWS {
  BULK_REMOVE = 'BULK_REMOVE',
  BULK_EXIT = 'BULK_EXIT'
}

enum RegistrationType {
  Online = 1,
  Offline = 2
}

interface RegisterValidator {
  processName: string;
  validator?: any;
  fundingPeriod?: number;
  totalRegistrationCost?: string;
  registrationType: RegistrationType;
  depositAmount: number;
}

enum ProcessType {
  Operator = 1,
  Validator = 2
}

export { BULK_FLOWS, RegistrationType, ProcessType };
export type { SingleCluster, SingleOperator, RegisterOperator, RegisterValidator };
