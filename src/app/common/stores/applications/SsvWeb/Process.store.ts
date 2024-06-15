import { action, computed, makeObservable, observable } from 'mobx';
import { ProcessType, RegisterOperator, RegisterValidator, SingleCluster, SingleOperator } from '~app/model/processes.model';

class ProcessStore {
  // Process data
  type!: ProcessType;
  process!: RegisterValidator | RegisterOperator;

  constructor() {
    makeObservable(this, {
      setProcess: action,
      process: observable,
      getProcess: computed,
      secondRegistration: computed
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
    return 'depositAmount' in this.process;
  }
}

export const processStore = new ProcessStore();
export default ProcessStore;
