import { action, observable } from 'mobx';

class MessageStore {
    @observable showSnackBar = false;
    @observable message: string = '';
    @observable messageSeverity: string = '';

    @action setShowSnackBar(status: boolean) {
        this.showSnackBar = status;
    }
    @action setMessage(text: string) {
        this.message = text;
    }
    @action setMessageSeverity(text: string) {
        this.messageSeverity = text;
    }
}

export default MessageStore;
