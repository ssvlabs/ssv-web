import { Process } from '~app/common/stores/applications/SsvWeb/processes/BaseProcess';

// eslint-disable-next-line no-unused-vars
enum RegistrationType {
  // eslint-disable-next-line no-unused-vars
  Online = 1,
  // eslint-disable-next-line no-unused-vars
  Offline = 2,
}

export interface RegisterValidator extends Process {
  validator?: any,
  fundingPeriod?: any;
  totalRegistrationCost?: string;
  registrationType: RegistrationType,
}