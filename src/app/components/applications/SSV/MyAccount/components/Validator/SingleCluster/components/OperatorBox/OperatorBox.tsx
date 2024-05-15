import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './OperatorBox.styles';
import Status from '~app/components/common/Status';
import { formatNumberToUi } from '~lib/utils/numbers';
import ToolTip from '~app/components/common/ToolTip/ToolTip';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import OperatorDetails
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import NotificationPopUp
  from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/OperatorBox/NotificationPopUp/NotificationPopUp';
import { fromWei, getFeeForYear } from '~root/services/conversions.service';

const OperatorBox = ({ operator }: { operator: any }) => {
  const stores = useStores();
  const isDeleted = operator.is_deleted;
  const operatorStore: OperatorStore = stores.Operator;
  const [newFee, setNewFee] = useState<string | null>(null);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<null | number>(null);
  const [updateOperatorFee, setUpdateOperatorFee] = useState<boolean>(false);
  const setShowPopUpHandler = () => showPopUp ? setShowPopUp(false) : setShowPopUp(true);

  useEffect(() => {
    getCurrentState();
  }, []);

  const getCurrentState = async () => {

    await operatorStore.syncOperatorFeeInfo(operator.id);
    if (operatorStore.operatorApprovalBeginTime && operatorStore.operatorApprovalEndTime && operatorStore.operatorFutureFee) {

      const todayDate = new Date();
      const endPendingStateTime = new Date(operatorStore.operatorApprovalEndTime * 1000);
      const startPendingStateTime = new Date(operatorStore.operatorApprovalBeginTime * 1000);
      setNewFee(formatNumberToUi(getFeeForYear(fromWei(operatorStore.operatorFutureFee.toString()))));
      const isInPendingState = todayDate >= startPendingStateTime && todayDate < endPendingStateTime;
      if (isInPendingState) {
        setCurrentStep(2);
        setUpdateOperatorFee(true);
      } else if (startPendingStateTime > todayDate) {
        setCurrentStep(1);
        setUpdateOperatorFee(true);
      }
    }
  };
  const classes = useStyles({ isDeleted, updateOperatorFee });

  if (operator === null) return <Grid item className={classes.OperatorBox}/>;

  return (
      <Grid item className={classes.OperatorBox}>
        {showPopUp && currentStep && newFee && <NotificationPopUp operator={operator} currentStep={currentStep} newFee={newFee} closePopUp={() => setShowPopUp(false)} />}
        <Grid className={classes.FirstSectionOperatorBox}>
          <OperatorDetails operator={operator}/>
        </Grid>
        <Grid container item className={classes.SecondSectionOperatorBox}>
          <Grid item container className={classes.ColumnWrapper}>
            <Grid item>
              <Grid container style={{ gap: 6, alignItems: 'center' }}>
                Status
                <ToolTip
                    text={'Is the operator performing duties for the majority of its validators for the last 2 epochs.'}/>
              </Grid>
            </Grid>
            <Grid item>30D Perform.</Grid>
            <Grid className={classes.YearlyFeeWrapper}>
              <Grid item onClick={setShowPopUpHandler}>Yearly Fee</Grid>
              {updateOperatorFee && <Grid className={classes.UpdateFeeIndicator} onClick={setShowPopUpHandler}/>}
            </Grid>
          </Grid>
          <Grid item container className={classes.ColumnWrapper}>
            <Status item={operator}/>
            <Grid item className={classes.BoldText}>{isDeleted ? '-' : `${operator.performance['30d'].toFixed(2) ?? 0  }%`}</Grid>
            <Grid item
                  className={classes.BoldText}>{isDeleted ? '-' : `${formatNumberToUi(getFeeForYear(fromWei(operator.fee)))} SSV`}</Grid>
          </Grid>
        </Grid>
      </Grid>
  );
};

export default observer(OperatorBox);
