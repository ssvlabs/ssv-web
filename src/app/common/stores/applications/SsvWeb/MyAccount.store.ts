import BaseStore from '~app/common/stores/BaseStore';
import { IOperator } from '~app/model/operator.model';

class MyAccountStore extends BaseStore {
  // OPERATOR
  ownerAddressOperators: IOperator[] = [];

  // VALIDATOR
  ownerAddressClusters: any = [];
}

export default MyAccountStore;
