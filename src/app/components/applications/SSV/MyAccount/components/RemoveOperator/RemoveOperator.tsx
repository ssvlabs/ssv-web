import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import CheckBox from '~app/components/common/CheckBox';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import { RegisterOperator } from '~app/common/stores/applications/SsvWeb/processes/RegisterOperator';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/RemoveOperator/RemoveOperator.styles';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getIsLoading, setIsLoading } from '~app/redux/appState.slice';
import { getStrategyRedirect } from '~app/redux/navigation.slice';

const RemoveOperator = () => {
  const stores = useStores();
  const navigate = useNavigate();
  // const [operator, setOperator] = useState(null);
  const [checkbox, setCheckBox] = useState(false);
  // const [leavingReason, setLeavingReason] = useState(0);
  // const [userTextReason, setUserTextReason] = useState('');
  const processStore: ProcessStore = stores.Process;
  const operatorStore: OperatorStore = stores.Operator;
  const process: RegisterOperator = processStore.process;
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(getIsLoading);
  const classes = useStyles({ isLoading });
  const strategyRedirect = useAppSelector(getStrategyRedirect);

  useEffect(() => {
    if (!process.item) return navigate(strategyRedirect);
  }, []);

  const checkboxHandler = () => {
    setCheckBox(!checkbox);
  };

  const submitForm = async () => {
    dispatch(setIsLoading(true));
    const isRemoved = await operatorStore.removeOperator(Number(process.item.id));
    dispatch(setIsLoading(false));
    if (isRemoved) {
      myAccountStore.getOwnerAddressOperators({ forcePage: 1 }).finally(() => {
        navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);
      });
    }
  };

  return (
    <Grid container item>
      <NewWhiteWrapper type={1} header={'Operator Details'} />
      <Grid className={classes.BodyWrapper}>
        <BorderScreen
          marginTop={0}
          withoutNavigation
          header={'Remove operator'}
          body={[
            <Grid container item>
              <Grid item className={classes.BulletsWrapper}>
                <ul>
                  <li>Removing your operator will cease your operation of all your managed validators,
                    which will reduce their fault tolerance and put them at risk.
                  </li>
                  <li>Immediately stop receiving future earnings from managed validators operation.</li>
                  <li>Remove yourself from the network and you will not longer be discoverable by other validators.</li>
                </ul>
              </Grid>
              <Grid item className={classes.Notice}>
                Please note that this process is irreversible and you would not be able to reactive this operator in the
                future.
              </Grid>
              <CheckBox onClickCallBack={checkboxHandler}
                        text={'I understand that by removing my operator I am potentially putting all of my managed validators at risk.'}/>

              <PrimaryButton disable={!checkbox} errorButton text={'Remove Operator'}
                             submitFunction={submitForm}/>
            </Grid>,
          ]}
        />
      </Grid>
    </Grid>
  );
};

export default observer(RemoveOperator);
