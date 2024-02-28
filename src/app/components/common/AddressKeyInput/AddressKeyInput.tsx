import React from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { useStyles } from '~app/components/common/AddressKeyInput/AddressKeyInput.styles';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { getLinks } from '~root/providers/networkInfo.provider';

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
    const { ETHERSCAN_URL, BEACONCHA_URL } = getLinks();
    const { address, withBeaconcha, withEtherScan, whiteBackgroundColor, withCopy } = props;
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
        window.open(`${BEACONCHA_URL}/validator/${address}`);
    };

    const openEtherScan = () => {
        GoogleTagManager.getInstance().sendEvent({
            category: 'external_link',
            action: 'click',
            label: 'Open Etherscan',
        });
        window.open(`${ETHERSCAN_URL}/address/${address}`);
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
