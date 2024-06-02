import { useEffect, useState } from 'react';
import { Grid } from '~app/atomicComponents';
import { useStyles } from './OperatorBox.styles';
import Status from '~app/components/common/Status';
import { formatNumberToUi } from '~lib/utils/numbers';
import ToolTip from '~app/components/common/ToolTip/ToolTip';
import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import NotificationPopUp from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/OperatorBox/NotificationPopUp/NotificationPopUp';
import { fromWei, getFeeForYear } from '~root/services/conversions.service';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook.ts';
import { fetchAndSetOperatorFeeInfo, getOperatorFeeData } from '~app/redux/operator.slice.ts';

const OperatorBox = ({ operator }: { operator: any }) => {
  const isDeleted = operator.is_deleted;
  const [newFee, setNewFee] = useState<string | null>(null);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<null | number>(null);
  const [updateOperatorFee, setUpdateOperatorFee] = useState<boolean>(false);
  const setShowPopUpHandler = () => (showPopUp ? setShowPopUp(false) : setShowPopUp(true));
  const operatorFeeData = useAppSelector(getOperatorFeeData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getCurrentState();
  }, []);

  const getCurrentState = async () => {
    const res = await dispatch(fetchAndSetOperatorFeeInfo(operator.id));
    if (res.payload.operatorApprovalBeginTime && res.payload.operatorApprovalEndTime && res.payload.operatorFutureFee) {
      const todayDate = new Date();
      const endPendingStateTime = new Date(operatorFeeData.operatorApprovalEndTime * 1000);
      const startPendingStateTime = new Date(operatorFeeData.operatorApprovalBeginTime * 1000);
      setNewFee(formatNumberToUi(getFeeForYear(fromWei(operatorFeeData.operatorFutureFee.toString()))));
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

  if (operator === null) return <Grid item className={classes.OperatorBox} />;

  return (
    <Grid item className={classes.OperatorBox}>
      {showPopUp && currentStep && newFee && <NotificationPopUp operator={operator} currentStep={currentStep} newFee={newFee} closePopUp={() => setShowPopUp(false)} />}
      <Grid className={classes.FirstSectionOperatorBox}>
        <OperatorDetails operator={operator} />
      </Grid>
      <Grid container item className={classes.SecondSectionOperatorBox}>
        <Grid item container className={classes.ColumnWrapper}>
          <Grid item>
            <Grid container style={{ gap: 6, alignItems: 'center' }}>
              Status
              <ToolTip text={'Is the operator performing duties for the majority of its validators for the last 2 epochs.'} />
            </Grid>
          </Grid>
          <Grid item>30D Perform.</Grid>
          <Grid className={classes.YearlyFeeWrapper}>
            <Grid item onClick={setShowPopUpHandler}>
              Yearly Fee
            </Grid>
            {updateOperatorFee && <Grid className={classes.UpdateFeeIndicator} onClick={setShowPopUpHandler} />}
          </Grid>
        </Grid>
        <Grid item container className={classes.ColumnWrapper}>
          <Status item={operator} />
          <Grid item className={classes.BoldText}>
            {isDeleted ? '-' : `${operator.performance['30d'].toFixed(2) ?? 0}%`}
          </Grid>
          <Grid item className={classes.BoldText}>
            {isDeleted ? '-' : `${formatNumberToUi(getFeeForYear(fromWei(operator.fee)))} SSV`}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default OperatorBox;
