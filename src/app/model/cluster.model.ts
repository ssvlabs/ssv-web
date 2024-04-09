import { IOperator } from '~app/model/operator.model';

interface ICluster {
  'id': number;
  'ownerAddress': string;
  'validatorCount': number;
  'networkFeeIndex': number;
  'index': number
  'balance': string
  'active': boolean;
  'operators': IOperator[];
}

export { ICluster };
