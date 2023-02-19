import { Process } from '~app/common/stores/applications/SsvWeb/processes/BaseProcess';

export interface SingleOperatorProcess extends Process {
  item?: any,
}