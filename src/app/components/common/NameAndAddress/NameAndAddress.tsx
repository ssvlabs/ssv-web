import React from 'react';
import { sha256 } from 'js-sha256';
import Grid from '@mui/material/Grid';
import { longStringShorten } from '~lib/utils/strings';
import { useStyles } from './NameAndAddress.styles';
import { decodeParameter } from '~root/services/conversions.service';

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
    const shaPublicKey = address ?? `0x${longStringShorten(sha256(decodeParameter('string', address ?? '')), 4)}`;

    return (
      <Grid container item className={styleWrapperClass}>
        {name && (
          <Grid item xs={12} className={`${classes.Name} ${styleNameClass || ''}`}>{name}</Grid>
          )}
        {address && <Grid item xs={12} className={`${classes.Address} ${styleAddressClass || ''}`}>{shaPublicKey}</Grid>}
      </Grid>
    );
};

export default NameAndAddress;
