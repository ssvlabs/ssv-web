import { Process } from '~app/common/stores/applications/SsvWeb/processes/BaseProcess';

export interface SingleClusterProcess extends Process {
  item?: any,
  operators?: any;
}