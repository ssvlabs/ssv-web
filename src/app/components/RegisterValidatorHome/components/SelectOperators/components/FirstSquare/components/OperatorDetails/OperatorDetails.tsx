import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useStores } from '~app/hooks/useStores';
import OperatorType from '~app/common/components/OperatorType/OperatorType';
import { useStyles } from './OperatorDetails.styles';
import { longStringShorten } from '~lib/utils/strings';
import { sha256 } from 'js-sha256';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import { IOperator } from '~app/common/stores/Operator.store';

type Props = {
    operator: IOperator
};

const OperatorDetails = (props: Props) => {
    const { operator } = props;
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;
    const classes = useStyles();
    const shaPublicKey = `0x${longStringShorten(sha256(walletStore.decodeKey(operator.pubkey)), 4)}`;

    return (
      <Grid container className={classes.Wrapper}>
        <Grid item className={classes.OperatorLogo} style={{ backgroundImage: operator.logo ? `url(${operator.logo})` : '' }} />
        <Grid container item xs>
          <Grid item className={classes.Name}>{operator.name}</Grid>
          <Grid item className={classes.OperatorType}>
            <OperatorType type={operator.type} />
          </Grid>
          <Grid item className={classes.Address} xs={12}>{shaPublicKey}</Grid>
        </Grid>
      </Grid>
    );
};

export default observer(OperatorDetails);
