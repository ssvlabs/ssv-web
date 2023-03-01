import { action, computed, makeObservable, observable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';
import { SingleCluster } from '~app/common/stores/applications/SsvWeb/processes/SingleCluster';
import { SingleOperator } from '~app/common/stores/applications/SsvWeb/processes/SingleOperator';
import { RegisterOperator } from '~app/common/stores/applications/SsvWeb/processes/RegisterOperator';
import { RegisterValidator } from '~app/common/stores/applications/SsvWeb/processes/RegisterValidator';

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
    console.log('secondRegistration ', 'registerValidator' in this.process);
    return 'registerValidator' in this.process;
  }
}

export { SingleCluster } from '~app/common/stores/applications/SsvWeb/processes/SingleCluster';
export { SingleOperator } from '~app/common/stores/applications/SsvWeb/processes/SingleOperator';
export { RegisterOperator } from '~app/common/stores/applications/SsvWeb/processes/RegisterOperator';
export { RegisterValidator } from '~app/common/stores/applications/SsvWeb/processes/RegisterValidator';

export default ProcessStore;
