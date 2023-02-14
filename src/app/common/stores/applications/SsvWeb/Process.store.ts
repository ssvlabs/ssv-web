import { action, makeObservable, observable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';

// eslint-disable-next-line no-unused-vars
export enum ProcessType {
  // eslint-disable-next-line no-unused-vars
  Operator = 1,
  // eslint-disable-next-line no-unused-vars
  Validator = 2,
}

export interface Process {
  item: any,
  type: ProcessType,
  processName: string,
}

class ProcessStore extends BaseStore {
  // Process data
  process: Process | undefined;

  constructor() {
    super();

    makeObservable(this, {
      setProcess: action,
      process: observable,
    });
  }


  setProcess(process: Process) {
    this.process = process;
  }
}

export default ProcessStore;
