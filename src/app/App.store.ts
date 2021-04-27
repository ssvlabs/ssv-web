import { action, observable } from 'mobx';

class AppStore {
    @observable isLoading = false;

    @action setLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }
}

export default AppStore;
