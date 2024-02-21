import { IOperator } from '~app/common/stores/applications/SsvWeb';

export interface IValidator {
  public_key: string,
  cluster: string,
  owner_address: string,
  status: string,
  is_valid: boolean,
  is_deleted: boolean,
  is_public_key_valid: boolean,
  is_shares_valid: boolean,
  is_operators_valid: boolean,
  operators: IOperator[],
  version: string,
  network: string
}
