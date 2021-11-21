import React from 'react';
import { Grid } from '@material-ui/core';
import { sha256 } from 'js-sha256';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { longStringShorten } from '~lib/utils/strings';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import { useStyles } from './Rows.styles';
// import styled from 'styled-components';
// import { Grid } from '@material-ui/core';
// import config, { translations } from '~app/common/config';
// import Tooltip from '~app/common/components/Tooltip/Tooltip';
// import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
// import { useStyles } from './Deposit.styles';
// import { getImage } from '~lib/utils/filePath';

type ItemProps = {
    publicKey: string,
    status: string,
    revenue?: string,
    name?: string,
    balance?: string,
    validators?: string,
    apr?: string
};

type Props = {
    items: ItemProps[],
    shouldDisplayStatus: boolean,
    shouldDisplayValidators: boolean
};

const Rows = (props: Props) => {
    const stores = useStores();
    const classes = useStyles();
    const walletStore: WalletStore = stores.Wallet;
    const { items, shouldDisplayStatus, shouldDisplayValidators } = props;

    const displayPublicKeyAndName = (publicKey: string, name: string | undefined, status: string) => {
        const isOperator = name;
        return (
          <Grid container item>
            {isOperator && <Grid item xs={12} className={classes.Name}>{name}</Grid>}
            <Grid container item>
              <Grid className={isOperator ? classes.PublicKey : classes.PublicKeyBold}>{`0x${longStringShorten(publicKey.replace('0x', ''), 4)}`}</Grid>
              <Grid className={classes.copyImage} />
              {!shouldDisplayStatus && displayStatus(status)}
            </Grid>
          </Grid>
        );
    };

    const displayStatus = (status: string) => {
        const isActive = status === 'active';
        return (
          <Grid container item className={`${classes.Status} ${isActive ? classes.Active : classes.Inactive}`}>
            <Grid item xs={12} className={classes.StatusText}>{status}</Grid>
          </Grid>
        );
    };

    const displayBalanceOrRevenue = (isValidator: boolean, amount: string | undefined) => {
        return (
          <Grid container item>
            <Grid item xs={12} className={classes.Balance}>{amount} {isValidator ? 'ETH' : 'SSV'}</Grid>
            <Grid item xs={12} className={classes.DollarBalance}>~$5.02</Grid>
          </Grid>
        );
    };

    const displayValidatorOrApr = (amount: string | undefined) => {
        return (
          <Grid container item>
            <Grid item xs={12} className={classes.ValidatorApr}>{amount}</Grid>
          </Grid>
        );
    };
    const displayAdditionalButtons = (isValidator: boolean, publicKey: string) => {
        let linkToExplorer: string = `${config.links.LINK_EXPLORER}/validators/${publicKey}`;
        if (!isValidator) {
            linkToExplorer = `${config.links.LINK_EXPLORER}/operators/${sha256(walletStore.decodeKey(publicKey))}`;
        }
        return (
          <Grid container item>
            {isValidator && <Grid className={classes.ExplorerImage} onClick={() => { window.open(`${getBaseBeaconchaUrl()}/validator/${publicKey}`); }} />}
            <Grid className={classes.ChartImage} onClick={() => { window.open(linkToExplorer); }} />
            <Grid className={classes.SettingsImage} />
          </Grid>
        );
    };

    return [
    ...items.map((data: ItemProps) => {
        const { publicKey, name, status, balance, revenue, validators, apr } = data;
        const response = [
            displayPublicKeyAndName(publicKey, name, status),
        ];

        if (shouldDisplayStatus) {
            response.push(displayStatus(status));
        }
        response.push(displayBalanceOrRevenue(validators === undefined, balance ?? revenue));

        if (shouldDisplayValidators) {
            response.push(displayValidatorOrApr(validators ?? `${apr}%`));
        }
        if (response.length > 2) {
            response.push(displayAdditionalButtons(validators === undefined, publicKey));
        }

        return response;
    }),
    ];
};

export default Rows;
