import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStores } from '~app/hooks/useStores';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import NotificationsStore from '~app/common/stores/Notifications.store';
import { useStyles } from './ValidatorKeyInput.styles';

type ValidatorPrivateKeyInputProps = {
    withCopy?: boolean,
    validatorKey: string,
    withBeaconcha?: boolean,
};

const ValidatorKeyInput = (props: ValidatorPrivateKeyInputProps) => {
    const stores = useStores();
    const classes = useStyles();
    const { validatorKey, withBeaconcha, withCopy } = props;
    const beaconchaBaseUrl = getBaseBeaconchaUrl();
    const href: string = `${beaconchaBaseUrl}/validator/${validatorKey}`;
    const notificationsStore: NotificationsStore = stores.Notifications;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(validatorKey);
        notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

    const openExplorer = () => {
        window.open(href);
    };

    return (
      <Grid
        container
        className={classes.Wrapper}
        data-testid="validator-private-key-slashing-input"
        >
        <Grid item xs className={classes.PublicKey}>{validatorKey}</Grid>
        {withCopy && <Grid item className={classes.CopyImage} onClick={copyToClipboard} />}
        {withBeaconcha && <Grid item className={classes.ExplorerImage} onClick={openExplorer} />}
      </Grid>
    );
};

export default observer(ValidatorKeyInput);