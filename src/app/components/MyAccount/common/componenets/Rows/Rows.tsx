import React from 'react';
import { sha256 } from 'js-sha256';
import { Grid } from '@material-ui/core';
import config from '~app/common/config';
import { longStringShorten } from '~lib/utils/strings';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import { useStyles } from './Rows.styles';
import Typography from '@material-ui/core/Typography';

type ItemProps = {
    apr?: string
    name?: string,
    status: string,
    revenue?: string,
    balance?: string,
    public_key: string,
    validators_count?: string,
};

type Props = {
    items: ItemProps[],
    shouldDisplayStatus?: boolean,
    shouldDisplayValidators?: boolean
};

const Rows = (props: Props) => {
    // const stores = useStores();
    const classes = useStyles();
    // const walletStore: WalletStore = stores.Wallet;
    const { items, shouldDisplayStatus, shouldDisplayValidators } = props;
    const copyToClipboard = (publicKey: string) => {
        navigator.clipboard.writeText(publicKey);
        // notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

    const displayPublicKeyAndName = (publicKey: string, name: string | undefined, status: string) => {
        return (
          <Grid container item>
            {name && <Grid item xs={12} className={classes.Name}>{name}</Grid>}
            <Grid container item className={classes.Name}>
              <Grid>{name ? longStringShorten(sha256(publicKey), 4) : `0x${longStringShorten(publicKey.replace('0x', ''), 4)}`}</Grid>
              <Grid className={classes.copyImage} onClick={() => { copyToClipboard(publicKey); }} />
              {!shouldDisplayStatus && displayStatus(status)}
            </Grid>
          </Grid>
        );
    };

    const displayStatus = (status: string) => {
        const isActive = status === 'active';
        const noValidators = status === 'No validators';
        let classesStatus = classes.Status;
        if (isActive) classesStatus += ` ${classes.Active}`;
        if (noValidators) classesStatus += ` ${classes.NoValidators}`;
        if (!isActive && !noValidators) classesStatus += ` ${classes.Inactive}`;

        return (
          <Grid container item className={classesStatus}>
            <Typography>{status}</Typography>
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
            linkToExplorer = `${config.links.LINK_EXPLORER}/operators/${sha256(publicKey)}`;
        }
        return (
          <Grid container item>
            {isValidator && <Grid className={classes.BeaconImage} onClick={() => { window.open(`${getBaseBeaconchaUrl()}/validator/${publicKey}`); }} />}
            <Grid className={classes.ExplorerImage} onClick={() => { window.open(linkToExplorer); }} />
            <Grid className={classes.SettingsImage} />
          </Grid>
        );
    };

    return [
    ...items.map((data: ItemProps) => {
        const { public_key, name, status, balance, revenue, validators_count, apr } = data;
        const response = [
            displayPublicKeyAndName(public_key, name, status),
        ];

        if (shouldDisplayStatus) {
            response.push(displayStatus(status));
        }
        response.push(displayBalanceOrRevenue(validators_count === undefined, balance ?? revenue));

        if (shouldDisplayValidators) {
            response.push(displayValidatorOrApr(validators_count ?? `${apr}%`));
        }
        if (response.length > 2) {
            response.push(displayAdditionalButtons(validators_count === undefined, public_key));
        }

        return response;
    }),
    ];
};

export default Rows;
