import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/SelectOperators.styles';
import SecondSquare from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/SecondSquare';
import FirstSquare from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/FirstSquare';
import { useStores } from '~app/hooks/useStores';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';

const SelectOperators = ({ editPage }: { editPage?: boolean }) => {
    const stores = useStores();
    const operatorStore: OperatorStore = stores.Operator;
    const classes = useStyles({ editPage });
    const [clusterSize, setClusterSize] = useState(operatorStore.clusterSize);

    const changeClusterSizeHandler = (size: number) => {
        operatorStore.setClusterSize(size);
        setClusterSize(size);
    };

    const generateRange = (to: number) => Array.from({ length: to }, (_, i) => i + 1);

    const boxes: Record<number, number[]> = {
        4: generateRange(4),
        7: generateRange(7),
        10: generateRange(10),
        13: generateRange(13),
    };
    return (
      <Grid container className={classes.Container}>
        <Grid item className={classes.FirstSquare}>
          <FirstSquare editPage={editPage ?? false} clusterBox={boxes[clusterSize]} clusterSize={clusterSize} setClusterSize={changeClusterSizeHandler} />
        </Grid>
        <Grid item className={classes.SecondSquare}>
          <SecondSquare clusterBox={boxes[clusterSize]} editPage={editPage ?? false} />
        </Grid>
      </Grid>
    );
};

export default observer(SelectOperators);
