import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from './NameAndAddress.styles';

type Props = {
    name?: string,
    address?: string,
    styleNameClass?: any,
    styleAddressClass?: any,
    styleWrapperClass?: any,
};
const NameAndAddress = (props: Props) => {
    const { name, address, styleWrapperClass, styleNameClass, styleAddressClass } = props;
    const classes = useStyles();

    return (
      <Grid container item className={styleWrapperClass}>
        {name && <Grid item xs={12} className={`${classes.Name} ${styleNameClass || ''}`}>{name}</Grid>}
        {address && <Grid item xs={12} className={`${classes.Address} ${styleAddressClass || ''}`}>{address}</Grid>}
      </Grid>
    );
};

export default NameAndAddress;
