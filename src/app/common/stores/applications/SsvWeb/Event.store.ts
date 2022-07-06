import { action } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';
import Events, { EventProps } from '~app/common/stores/Abstracts/Events';

class EventStore extends BaseStore implements Events {
    @action.bound
    send(props: EventProps) {
        // @ts-ignore
        window.dataLayer.push({
            'event': 'customEvent',
            'label': props.label,
            'action': props.action,
            'category': props.category,
        });
    }
}

export default EventStore;