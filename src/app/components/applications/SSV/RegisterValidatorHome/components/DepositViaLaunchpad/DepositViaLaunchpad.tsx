import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import { translations } from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/CreateValidator/CreateValidator.styles';
import { getBeaconChainLink, getLaunchpadLink } from '~root/providers/networkInfo.provider';
import { ButtonSize } from '~app/enums/Button.enum';
import { PrimaryButton } from '~app/atomicComponents';

const DepositViaLaunchpad = () => {
  const stores = useStores();
  const classes = useStyles();
  const validatorStore: ValidatorStore = stores.Validator;

  const redirectToLaunchpad = async () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Visit Ethereum Launchpad'
    });
    window.open(getLaunchpadLink());
  };

  return (
    <BorderScreen
      blackHeader
      header={translations.VALIDATOR.DEPOSIT.TITLE}
      body={[
        <Grid container spacing={6}>
          <Grid item className={classes.Text} xs={12}>
            Your validator is not yet activated on the Beacon Chain.
          </Grid>
          <Grid item className={classes.Text} xs={12}>
            If you have deposited your validator recently, keep in mind that it could take up to ~24 hours until it is picked up by the Beacon Chain.
          </Grid>
          <Grid item className={classes.Text} xs={12}>
            You can keep track on the status of your validator activation on:
            <Link
              href={`${getBeaconChainLink()}/validator/${validatorStore.keyStorePublicKey}`}
              target="_blank"
              onClick={() => {
                GoogleTagManager.getInstance().sendEvent({
                  category: 'external_link',
                  action: 'click',
                  label: 'Open Beaconcha'
                });
              }}
            >
              <Typography noWrap>{`${getBeaconChainLink()}/validator/${validatorStore.keyStorePublicKey}`}</Typography>
            </Link>
          </Grid>

          <Grid item className={classes.Text} xs={12}>
            If you haven&apos;t deposited your validator yet, follow Ethereum&apos;s launchpad instructions to deposit your validator to the Ethereum deposit contract.
          </Grid>
          <Grid item container xs={12}>
            <Grid item className={classes.rhinoImage} />
          </Grid>
          <PrimaryButton text={'Visit Ethereum Launchpad'} onClick={redirectToLaunchpad} size={ButtonSize.XL} />
        </Grid>
      ]}
    />
  );
};
export default observer(DepositViaLaunchpad);
