import  { useState } from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/SelectOperators.styles';
import SecondSquare from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/SecondSquare';
import FirstSquare from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/FirstSquare';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook.ts';
import { getClusterSize, setClusterSize } from '~app/redux/operator.slice.ts';

const SelectOperators = ({ editPage }: { editPage?: boolean }) => {
    const dispatch = useAppDispatch();
    const classes = useStyles({ editPage });
    const size = useAppSelector(getClusterSize);
    const [currentClusterSize, setCurrentClusterSize] = useState(size);

    const changeClusterSizeHandler = (size: number) => {
        dispatch(setClusterSize(size));
        setCurrentClusterSize(size);
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
          <FirstSquare editPage={editPage ?? false} clusterBox={boxes[currentClusterSize]} clusterSize={currentClusterSize} setClusterSize={changeClusterSizeHandler} />
        </Grid>
        <Grid item className={classes.SecondSquare}>
          <SecondSquare clusterBox={boxes[currentClusterSize]} editPage={editPage ?? false} />
        </Grid>
      </Grid>
    );
};

export default observer(SelectOperators);
