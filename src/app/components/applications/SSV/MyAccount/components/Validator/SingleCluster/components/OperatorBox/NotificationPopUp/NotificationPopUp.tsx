import { Grid, Typography } from '@mui/material';
import config from '~app/common/config';
import { formatNumberToUi } from '~lib/utils/numbers';
import LinkText from '~app/components/common/LinkText/LinkText';
import ChangeFeeDisplayValues from '~app/components/common/FeeUpdateTo/ChangeFeeDisplayValues';
import UpdateFeeState from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/UpdateFeeState';
import Stepper from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/Stepper';
import UpdateFeeProcesses from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/OperatorBox/NotificationPopUp/UpdateFeeProcesses';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/OperatorBox/NotificationPopUp/NotificationPopUp.styles';
import { fromWei, getFeeForYear } from '~root/services/conversions.service';

type NotificationPopUpProps = {
  closePopUp: Function;
  operator: any;
  currentStep: number;
  newFee: string;
};

const NotificationPopUp = ({
  operator,
  closePopUp,
  currentStep,
  newFee
}: NotificationPopUpProps) => {
  const classes = useStyles({});

  return (
    <Grid className={classes.PopUpWrapper}>
      <Grid className={classes.CloseButtonWrapper}>
        <Typography className={classes.PopUpTitle}>
          {operator.name} has started a fee change
        </Typography>
        <Grid
          className={classes.ClosePopUpButton}
          onClick={() => closePopUp()}
        />
      </Grid>
      <Grid item container>
        <Grid>
          <ChangeFeeDisplayValues
            currentCurrency={'SSV'}
            newFee={newFee}
            oldFee={formatNumberToUi(getFeeForYear(fromWei(operator.fee)))}
          />
        </Grid>
        <Grid>
          <UpdateFeeState operatorId={operator.id} />
        </Grid>
      </Grid>
      <Grid className={classes.Line} />
      <Typography className={classes.PopUpTitle}>
        Update Fee Process Overview
      </Typography>
      <Stepper step={currentStep} subTextAlign={''} />
      <UpdateFeeProcesses />
      <LinkText
        text={'Read documentation'}
        link={config.links.SSV_UPDATE_FEE_DOCS}
      />
    </Grid>
  );
};

export default NotificationPopUp;
