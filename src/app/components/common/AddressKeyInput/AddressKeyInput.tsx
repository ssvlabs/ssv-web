import Grid from '@mui/material/Grid';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { useStyles } from '~app/components/common/AddressKeyInput/AddressKeyInput.styles';
import { getBeaconChainLink, getEtherScanLink } from '~root/providers/networkInfo.provider';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { useAppDispatch } from '~app/hooks/redux.hook';

type ValidatorPrivateKeyInputProps = {
  address: string;
  withCopy?: boolean;
  withBeaconcha?: boolean;
  withEtherScan?: boolean;
  whiteBackgroundColor?: boolean;
};

const AddressKeyInput = ({ address, withBeaconcha, withEtherScan, whiteBackgroundColor, withCopy }: ValidatorPrivateKeyInputProps) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    dispatch(
      setMessageAndSeverity({
        message: 'Copied to clipboard.',
        severity: 'success'
      })
    );
  };

  const openBeaconcha = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Open Beaconcha'
    });
    window.open(`${getBeaconChainLink()}/validator/${address}`);
  };

  const openEtherScan = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Open Etherscan'
    });
    window.open(`${getEtherScanLink()}/address/${address}`);
  };

  return (
    <Grid container className={`${classes.Wrapper} ${whiteBackgroundColor ? classes.WhiteBackGround : ''}`} data-testid="validator-private-key-slashing-input">
      <Grid item xs className={classes.PublicKey}>
        {address}
      </Grid>
      {withCopy && <ImageDiv image={'copy'} width={24} height={24} onClick={copyToClipboard} />}
      {withEtherScan && <Grid item className={classes.EtherScanImage} onClick={openEtherScan} />}
      {withBeaconcha && <Grid item className={classes.BeaconImage} onClick={openBeaconcha} />}
    </Grid>
  );
};

export default AddressKeyInput;
