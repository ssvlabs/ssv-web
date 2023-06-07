import { Process } from '~app/common/stores/applications/SsvWeb/processes/BaseProcess';

export interface SingleOperator extends Process {
  item?: any,
}