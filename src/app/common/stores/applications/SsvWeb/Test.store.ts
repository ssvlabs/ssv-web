import { makeObservable, observable, computed, action } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';

class TestStore extends BaseStore {
  price = 0;
  amount = 1;

  constructor(price: number) {
    super();
    makeObservable(this, {
      price: observable,
      amount: observable,
      total: computed,
      setPrice: action.bound,
    });
    this.price = price;
  }

  get total() {
    console.log('Computing...');
    return this.price * this.amount;
  }

  setPrice(price: number) {
    this.price = price;
  }
}

export default TestStore;