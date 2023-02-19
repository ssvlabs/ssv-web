import { action, computed, makeObservable, observable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';
import { RegisterOperator } from '~app/common/stores/applications/SsvWeb/processes/RegisterOperator';
import { RegisterValidator } from '~app/common/stores/applications/SsvWeb/processes/RegisterValidator';
import { SingleOperatorProcess } from '~app/common/stores/applications/SsvWeb/processes/SingleOperator';
import { SingleValidatorProcess } from '~app/common/stores/applications/SsvWeb/processes/SingleValidator';

// eslint-disable-next-line no-unused-vars
enum ProcessType {
  // eslint-disable-next-line no-unused-vars
  Operator = 1,
  // eslint-disable-next-line no-unused-vars
  Validator = 2,
}

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
    });
  }


  setProcess(process: RegisterValidator | RegisterOperator | SingleValidatorProcess | SingleOperatorProcess, type: ProcessType) {
    this.type = type;
    this.process = process;
  }

  get getProcess() {
    return this.process;
  }

  get isValidatorFlow() {
    return this.type === ProcessType.Validator;
  }
}

export { RegisterOperator } from '~app/common/stores/applications/SsvWeb/processes/RegisterOperator';
export { RegisterValidator } from '~app/common/stores/applications/SsvWeb/processes/RegisterValidator';
export { SingleOperatorProcess } from '~app/common/stores/applications/SsvWeb/processes/SingleOperator';
export { SingleValidatorProcess } from '~app/common/stores/applications/SsvWeb/processes/SingleValidator';

export default ProcessStore;
