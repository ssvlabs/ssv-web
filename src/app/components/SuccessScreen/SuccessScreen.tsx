import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import SSVStore from '~app/common/stores/SSV.store';
import { useHistory } from 'react-router-dom';
import config from '~app/common/config';

const SuccessScreen = () => {
    const stores = useStores();
    const history = useHistory();
    const ssv: SSVStore = stores.ssv;

    useEffect(() => {
        if (!ssv.newOperatorRegisterSuccessfully) history.push(config.routes.OPERATOR.START);
    }, [ssv.newOperatorRegisterSuccessfully]);
    return (
      <div>works!</div>
    );
};

export default observer(SuccessScreen);
