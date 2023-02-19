import { Process } from '~app/common/stores/applications/SsvWeb/processes/BaseProcess';

export interface SingleValidatorProcess extends Process {
  item?: any,
  operators?: any;
}