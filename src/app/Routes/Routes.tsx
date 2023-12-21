import React from 'react';
import { useStores } from '~app/hooks/useStores';
import ApplicationStore from '~app/common/stores/Abstracts/Application';

const Routes = () => {
    const stores = useStores();
    const applicationStore: ApplicationStore = stores.Application;
    const ApplicationRoutes = applicationStore.applicationRoutes();
    return <ApplicationRoutes />;
};

export default Routes;
