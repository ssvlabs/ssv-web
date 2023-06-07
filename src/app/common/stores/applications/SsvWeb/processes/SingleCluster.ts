import { Process } from '~app/common/stores/applications/SsvWeb/processes/BaseProcess';

interface RegisterValidator {
  depositAmount?: any;
}
export interface SingleCluster extends Process {
  item?: any,
  operators?: any;
  validator?: any;
  registerValidator?: RegisterValidator;
}