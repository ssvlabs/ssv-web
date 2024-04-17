import { IOperator } from '~app/model/operator.model';

interface ICluster {
  id: number;
  clusterId: string;
  ownerAddress: string;
  validatorCount: number;
  networkFeeIndex: number;
  index: number;
  balance: string; // actual balance of the cluster, not snapshot
  active: boolean;
  isLiquidated: boolean;
  runWay: number;
  burnRate: BigInteger,
  operators: IOperator[];
  clusterData: {
    // use this snapshot data for contract interactions
    active: boolean;
    balance: string; // the balance of the cluster after last contract interaction (deposit, withdraw)
    index: string;
    networkFeeIndex: string;
    validatorCount: number;
  }
}

export { ICluster };
