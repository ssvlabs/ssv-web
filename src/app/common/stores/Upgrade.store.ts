import { action, computed, observable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';

export const UpgradeSteps = {
  home: 0,
};

class UpgradeStore extends BaseStore {
  @observable step = UpgradeSteps.home;
  @observable cdtValue = 0;
  @observable cdtBalance = 10.123;

  @action.bound
  setStep(step: number) {
    this.step = step;
  }

  @action.bound
  setCdtValue(value: number) {
    this.cdtValue = value;
  }

  @action.bound
  setCdtBalance(balance: number) {
    this.cdtBalance = balance;
  }

  @computed
  get ssvValue() {
    return this.cdtValue * 0.01;
  }
}

export default UpgradeStore;
