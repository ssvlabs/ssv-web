import { action, observable } from 'mobx';

class NotificationsStore {
    @observable message: string = '';
    @observable showSnackBar = false;
    @observable messageSeverity: string = '';

    @action.bound
    setShowSnackBar(status: boolean) {
        this.showSnackBar = status;
    }
    @action.bound
    setMessage(text: string) {
        this.message = text;
    }
    @action.bound
    setMessageSeverity(text: string) {
        this.messageSeverity = text;
    }
}

export default NotificationsStore;
