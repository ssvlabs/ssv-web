interface SingleOperator {
  processName: string;
  item?: any;
}

interface SingleCluster {
  processName: string;
  item?: any;
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
  item?: any;
}

enum BULK_FLOWS {
  BULK_REMOVE = 'BULK_REMOVE',
  BULK_EXIT = 'BULK_EXIT'
}

enum RegistrationType {
  // eslint-disable-next-line no-unused-vars
  Online = 1,
  // eslint-disable-next-line no-unused-vars
  Offline = 2
}

interface RegisterValidator {
  processName: string;
  validator?: any;
  fundingPeriod?: any;
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
