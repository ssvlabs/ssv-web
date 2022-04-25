import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from './SsvAndSubTitle.styles';

type Props = {
    ssv: any,
    bold?: boolean,
    subText?: string,
    gray80?: boolean,
    subTextCenter?: boolean,
};
const SsvAndSubTitle = (props: Props) => {
    const { ssv, subText, gray80, bold, subTextCenter } = props;
    const classes = useStyles({ bold, gray80 });

    return (
      <Grid container item style={{ textAlign: subTextCenter ? 'center' : 'right' }}>
        <Grid item xs={12} className={classes.Balance}>{ssv} SSV</Grid>
        {subText && <Grid item xs={12} className={classes.DollarBalance}>{subText}</Grid>}
      </Grid>
    );
};

export default SsvAndSubTitle;
