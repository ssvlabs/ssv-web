import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStores } from '~app/hooks/useStores';
import { getBaseBeaconchaUrl, getEtherScanUrl } from '~lib/utils/beaconcha';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from './AddressKeyInput.styles';
import ImageDiv from '~app/common/components/ImageDiv/ImageDiv';

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
        window.open(`${beaconchaBaseUrl}/validator/${address}`);
    };

    const openEtherScan = () => {
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