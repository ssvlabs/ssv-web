import React from 'react';
import { observer } from 'mobx-react';
import AppBar from '~app/components/common/AppBar/AppBar';
import { NETWORKS } from '~lib/utils/envHelper';

const FaucetAppBar = () => {
    return <AppBar excludeNetworks={[NETWORKS.MAINNET]} />;
};

export default observer(FaucetAppBar);
