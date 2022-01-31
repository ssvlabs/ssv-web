import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from './SsvAndSubTitle.styles';

type Props = {
    ssv: any,
    bold?: boolean,
    subText?: string,
    subTextCenter?: boolean,
};
const SsvAndSubTitle = (props: Props) => {
    const { ssv, subText, bold, subTextCenter } = props;
    const classes = useStyles();

    return (
      <Grid container item style={{ textAlign: subTextCenter ? 'center' : 'right' }}>
        <Grid item xs={12} className={bold ? classes.BoldBalance : classes.Balance}>{ssv} SSV</Grid>
        {subText && <Grid item xs={12} className={classes.DollarBalance}>{subText}</Grid>}
      </Grid>
    );
};

export default SsvAndSubTitle;
