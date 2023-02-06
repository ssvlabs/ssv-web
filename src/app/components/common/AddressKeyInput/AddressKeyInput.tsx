import React from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import { getBaseBeaconchaUrl, getEtherScanUrl } from '~lib/utils/beaconcha';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from './AddressKeyInput.styles';

type ValidatorPrivateKeyInputProps = {
    address: string,
    withCopy?: boolean,
    withBeaconcha?: boolean,
    withEtherScan?: boolean,
    whiteBackgroundColor?: boolean,
};

const AddressKeyInput = (props: ValidatorPrivateKeyInputProps) => {
    const stores = useStores();
    const classes = useStyles();
    const { address, withBeaconcha, withEtherScan, whiteBackgroundColor, withCopy } = props;
    const etherScan = getEtherScanUrl();
    const beaconchaBaseUrl = getBaseBeaconchaUrl();
    const notificationsStore: NotificationsStore = stores.Notifications;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address);
        notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

    const openBeaconcha = () => {
        GoogleTagManager.getInstance().sendEvent({
            category: 'external_link',
            action: 'click',
            label: 'Open Beaconcha',
        });
        window.open(`${beaconchaBaseUrl}/validator/${address}`);
    };

    const openEtherScan = () => {
        GoogleTagManager.getInstance().sendEvent({
            category: 'external_link',
            action: 'click',
            label: 'Open Etherscan',
        });
        window.open(`${etherScan}/address/${address}`);
    };

    return (
      <Grid
        container
        className={`${classes.Wrapper} ${whiteBackgroundColor ? classes.WhiteBackGround : ''}`}
        data-testid="validator-private-key-slashing-input"
      >
        <Grid item xs className={classes.PublicKey}>{address}</Grid>
        {withCopy && <ImageDiv image={'copy'} width={24} height={24} onClick={copyToClipboard} />}
        {withEtherScan && <Grid item className={classes.EtherScanImage} onClick={openEtherScan} />}
        {withBeaconcha && <Grid item className={classes.BeaconImage} onClick={openBeaconcha} />}
      </Grid>
    );
};

export default observer(AddressKeyInput);
