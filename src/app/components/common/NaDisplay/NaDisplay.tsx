import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ToolTip from '~app/components/common/ToolTip';
import { useStyles } from '~app/components/common/NaDisplay/NaDisplay.styles';

type NaDisplayProps = {
    size?: number;
    weight?: number;
};
const NaDisplay = ({ size, weight } : NaDisplayProps) => {
    const classes = useStyles({ size, weight });

    return (
        <Grid container item alignItems={'center'}>
            <Typography className={classes.LightGrey}>N/A</Typography>
            <ToolTip placement={'right'}
                     text={'Balance and runway are pending calculation, please check again in a few minutes '}/>
        </Grid>

    );
};

export default observer(NaDisplay);
