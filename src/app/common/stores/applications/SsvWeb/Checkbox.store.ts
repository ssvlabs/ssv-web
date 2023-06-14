import { observable, makeObservable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';

class CheckboxStore extends BaseStore  {
    checkedCondition: boolean = false;

    constructor() {
        super();
        makeObservable(this, {
            checkedCondition: observable,
        });
    }

    setCheckboxStateFalse() {
        this.checkedCondition = false;
    }

    setCheckboxStateTrue() {
        this.checkedCondition = true;
    }
}

export default CheckboxStore;
