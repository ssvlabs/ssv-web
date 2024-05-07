import  { useState } from 'react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ChangeFeeDisplayValues from '~app/components/common/FeeUpdateTo/ChangeFeeDisplayValues';
import { UpdateFeeProps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/UpdateFee';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';
import { getOperator, getOperatorBalance } from '~root/services/operator.service';
import { SingleOperator } from '~app/model/processes.model';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsContractWallet } from '~app/redux/wallet.slice';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import { ButtonSize } from '~app/enums/Button.enum';

const DecreaseFlow = ({ oldFee, newFee, currency }: UpdateFeeProps) => {
  const stores = useStores();
  const navigate = useNavigate();
  const classes = useStyles({});
  const processStore: ProcessStore = stores.Process;
  const operatorStore: OperatorStore = stores.Operator;
  const [buttonText, setButtonText] = useState('Update Fee');
  const [updated, setUpdated] = useState(false);
  const isContractWallet = useAppSelector(getIsContractWallet);
  const process: SingleOperator = processStore.getProcess;
  const operator = process.item;

  const onUpdateFeeHandle = async () => {
    if (updated) {
      navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);
    } else {
      await operatorStore.decreaseOperatorFee({ operator, newFee, isContractWallet });
      const newOperatorData = await getOperator(operatorStore.processOperatorId);
      const balance = await getOperatorBalance(newOperatorData.id);
      processStore.setProcess({
        processName: 'single_operator',
        item: { ...newOperatorData, balance },
      }, 1);
      setButtonText('Back To My Account');
      setUpdated(true);
    }
  };

  return (
    <BorderScreen
      blackHeader
      withoutNavigation
      header={'Update Fee'}
      withoutBorderBottom={true}
      body={[
        <Grid container className={classes.ChangeFeeWrapper}>
          <Typography>{updated ? 'You have successfully updated your fee. The new fee will take effect immediately.' : 'Your new operator annual fee will be updated to.'}</Typography>
          <ChangeFeeDisplayValues currentCurrency={currency} newFee={newFee} oldFee={oldFee}/>
          {!updated && <Grid item className={classes.Notice}>
            <Grid item className={classes.BulletsWrapper}>
              {Number(newFee) === 0 ? 'Please note that operators who have set their fee to 0 will not have the option to increase or modify their fee in the future.' : 'Keep in mind that the process of increasing your fee is different than decreasing it, andreturning back to your current fee in the future would take longer. Read more on fee changes'}
            </Grid>
          </Grid>}
          <PrimaryButton text={buttonText} onClick={onUpdateFeeHandle} size={ButtonSize.XL}/>
        </Grid>,
      ]}
    />
  );
};

export default DecreaseFlow;
