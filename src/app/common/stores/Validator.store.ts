import { action, observable } from 'mobx';

export type IOperator = {
  name: string,
  publicKey: string,
  selected: boolean
};

class ValidatorStore {
  @observable validatorPrivateKey: string = '';
  @observable operators: IOperator[] = [];
  @observable loading: boolean = false;

  @action.bound
  setValidatorPrivateKey(validatorPrivateKey: string) {
    this.validatorPrivateKey = validatorPrivateKey;
  }

  /**
   * Find operator by publicKey
   * @param publicKey
   */
  findOperator(publicKey: string): { operator: IOperator | null, index: number } {
    for (let i = 0; i < this.operators?.length || 0; i += 1) {
      if (this.operators[i].publicKey === publicKey) {
        return { operator: this.operators[i], index: i };
      }
    }
    return { operator: null, index: -1 };
  }

  @action.bound
  isOperatorSelected(publicKey: string): boolean {
    const { operator } = this.findOperator(publicKey);
    return operator ? operator.selected : false;
  }

  @action.bound
  unselectOperator(publicKey: string) {
    if (this.isOperatorSelected(publicKey)) {
      const { operator, index } = this.findOperator(publicKey);
      if (operator) {
        operator.selected = false;
        this.operators[index] = operator;
        this.operators = Array.from(this.operators);
      }
    }
  }

  @action.bound
  selectOperator(publicKey: string) {
    const { operator, index } = this.findOperator(publicKey);
    if (operator) {
      operator.selected = true;
      this.operators[index] = operator;
      this.operators = Array.from(this.operators);
    }
  }

  @action.bound
  async loadAvailableOperators() {
    this.loading = true;
    return new Promise((resolve => {
      setTimeout(() => {
        this.operators = [
          {
            name: 'Operator #1',
            publicKey: '0x1a1b7a4e12a5554bf00d74d0a4df5ef7420599574ee3eca102aee47bc14d56692',
            selected: false,
          },
          {
            name: 'Operator #2',
            publicKey: '0x2a1b7a4e12a5554bf00d74d0a4df5ef7420599574ee3eca102aee47bc14d56692',
            selected: false,
          },
          {
            name: 'Operator #3',
            publicKey: '0x3a1b7a4e12a5554bf00d74d0a4df5ef7420599574ee3eca102aee47bc14d56692',
            selected: false,
          },
          {
            name: 'Operator #4',
            publicKey: '0x4a1b7a4e12a5554bf00d74d0a4df5ef7420599574ee3eca102aee47bc14d56692',
            selected: false,
          },
          {
            name: 'Operator #5',
            publicKey: '0x5a1b7a4e12a5554bf00d74d0a4df5ef7420599574ee3eca102aee47bc14d56692',
            selected: false,
          },
        ];
        resolve(true);
        this.loading = false;
      });
    }));
  }
}

export default ValidatorStore;
