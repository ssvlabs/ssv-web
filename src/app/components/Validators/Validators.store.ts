import { action, observable } from 'mobx';

class ValidatorsStore {
    @observable isLoading = false;
    @observable error = '';
    @observable validators: any[] = [];

    @action async load(): Promise<any> {
        console.debug('Loading validators..');
        this.isLoading = true;
        this.validators = [];
        return fetch('https://6081764373292b0017cdd98c.mockapi.io/api/v1/validators')
            .then(async (response) => {
                this.validators = await response.json();
                this.error = '';
                this.isLoading = false;
                return this.validators;
            })
            .catch((error) => {
                this.error = error.message;
                this.isLoading = false;
            });
    }
}

export default ValidatorsStore;
