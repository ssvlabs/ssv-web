import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import ApplicationStore from '~app/common/stores/Abstracts/Application';

const Routes = () => {
    const stores = useStores();
    const applicationStore: ApplicationStore = stores.Application;

    const conditionalRoutes = () => {
        const ApplicationRoutes = applicationStore.applicationRoutes();
        return <ApplicationRoutes />;
    };

    return conditionalRoutes();
};

export default observer(Routes);
