import React from 'react';
import { observer } from 'mobx-react';
import { NETWORKS } from '~lib/utils/envHelper';
import AppBar from '~app/components/common/AppBar/AppBar';

const DistributionAppBar = () => {
    return <AppBar excludeNetworks={[NETWORKS.HOLESKY]} />;
};

export default observer(DistributionAppBar);
