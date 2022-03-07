import React from 'react';
import { sha256 } from 'js-sha256';
import Grid from '@material-ui/core/Grid';
import { useStores } from '~app/hooks/useStores';
import { longStringShorten } from '~lib/utils/strings';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
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
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;
    const shaPublicKey = address ?? `0x${longStringShorten(sha256(walletStore.decodeKey(address ?? '')), 4)}`;

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
