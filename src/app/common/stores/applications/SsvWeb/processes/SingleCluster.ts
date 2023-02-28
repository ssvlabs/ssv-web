import { Process } from '~app/common/stores/applications/SsvWeb/processes/BaseProcess';

export interface SingleCluster extends Process {
  item?: any,
  operators?: any;
  validator?: any;
}