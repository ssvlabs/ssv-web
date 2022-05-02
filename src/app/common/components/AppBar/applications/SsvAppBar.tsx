import React from 'react';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import AppBar from '~app/common/components/AppBar/AppBar';
import ApplicationStore from '~app/common/stores/Abstracts/Application';

const SsvAppBar = () => {
    const stores = useStores();
    const history = useHistory();
    const location = useLocation();
    const applicationStore: ApplicationStore = stores.Application;
    const hasOperatorsOrValidators = applicationStore.strategyRedirect === '/dashboard';
    const backgroundColor = location.pathname.includes('/dashboard/validator')
    || location.pathname.includes('/dashboard/operator')
        ? applicationStore.theme.colors.white
        : '';

    const moveToDashboard = () => {
        if (applicationStore.isLoading) return;
        if (process.env.REACT_APP_NEW_STAGE && hasOperatorsOrValidators) {
            // @ts-ignore
            applicationStore.whiteNavBarBackground = false;
            history.push('/dashboard');
        }
    };
    const openDocs = () => {
        window.open(config.links.LINK_SSV_DEV_DOCS);
    };

    const openExplorer = () => {
        window.open(config.links.LINK_EXPLORER);
    };

    const buttons = [
        {
            label: 'My Account', blueColor: true, onClick: moveToDashboard,
        },
        {
            label: 'Explorer', onClick: openExplorer,
        },
        {
            label: 'Docs', onClick: openDocs,
        },
    ];

    return <AppBar backgroundColor={backgroundColor} buttons={buttons} />;
};

export default observer(SsvAppBar);
