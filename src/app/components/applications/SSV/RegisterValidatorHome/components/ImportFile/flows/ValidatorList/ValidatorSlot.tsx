import Grid from '@mui/material/Grid';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/ValidatorList/ValidatorList.styles';
import { longStringShorten } from '~lib/utils/strings';
import { getBeaconChainLink } from '~root/providers/networkInfo.provider';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { useAppDispatch } from '~app/hooks/redux.hook';

const ValidatorSlot = ({
  validatorPublicKey,
  errorMessage,
  registered,
  isSelected
}: {
  validatorPublicKey: string;
  errorMessage?: string;
  registered?: boolean;
  isSelected: boolean;
}) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const copyToClipboard = (publicKey: string) => {
    navigator.clipboard.writeText(publicKey);
    dispatch(setMessageAndSeverity({ message: 'Copied to clipboard.', severity: 'success' }));
  };

  const openBeaconcha = (publicKey: string) => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Open Beaconcha'
    });
    window.open(`${getBeaconChainLink()}/validator/${publicKey}`);
  };

  return (
    <Grid className={`${classes.ValidatorSlotWrapper} ${isSelected && classes.SelectedValidatorSlot} ${errorMessage && classes.ErrorValidatorSlot}`}>
      <Grid className={classes.ValidatorKeyWrapper}>
        {longStringShorten(validatorPublicKey, 6, 4)}
        <ImageDiv onClick={() => copyToClipboard(validatorPublicKey)} image={'copy'} width={24} height={24} />
        <ImageDiv onClick={() => openBeaconcha(validatorPublicKey)} image={'beacon'} width={24} height={24} />
      </Grid>
      {errorMessage && <Grid className={classes.ErrorBadge}>{errorMessage}</Grid>}
      {registered && <Grid className={classes.RegisteredBadge}>Registered</Grid>}
    </Grid>
  );
};

export default ValidatorSlot;
