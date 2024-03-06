import { action, computed, makeObservable, observable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';
import { RegisterValidator, RegisterOperator, SingleOperator, SingleCluster, ProcessType } from '~app/model/processes.model';

class ProcessStore extends BaseStore {
  // Process data
  type!: ProcessType;
  process!: RegisterValidator | RegisterOperator;

  constructor() {
    super();

    makeObservable(this, {
      setProcess: action,
      process: observable,
      getProcess: computed,
      secondRegistration: computed,
    });
  }


  setProcess(process: RegisterValidator | RegisterOperator | SingleCluster | SingleOperator, type: ProcessType) {
    this.type = type;
    this.process = process;
  }

  get getProcess() {
    return this.process;
  }

  get isValidatorFlow() {
    return this.type === ProcessType.Validator;
  }

  get secondRegistration() {
    return 'registerValidator' in this.process;
  }
}

export default ProcessStore;
