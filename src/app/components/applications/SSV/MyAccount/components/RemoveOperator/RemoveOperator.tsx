import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import CheckBox from '~app/components/common/CheckBox';
import BorderScreen from '~app/components/common/BorderScreen';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/RemoveOperator/RemoveOperator.styles';
import { useAppSelector, useAppDispatch } from '~app/hooks/redux.hook';
import { getStrategyRedirect } from '~app/redux/navigation.slice';
import { RegisterOperator } from '~app/model/processes.model';
import { getIsContractWallet } from '~app/redux/wallet.slice';
import ErrorButton from '~app/atomicComponents/ErrorButton';
import { ButtonSize } from '~app/enums/Button.enum';
import { fetchOperators } from '~app/redux/account.slice';

const RemoveOperator = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const processStore: ProcessStore = stores.Process;
  const operatorStore: OperatorStore = stores.Operator;
  const process: RegisterOperator = processStore.process;
  const dispatch = useAppDispatch();
  const strategyRedirect = useAppSelector(getStrategyRedirect);
  const isContractWallet = useAppSelector(getIsContractWallet);
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles({ isLoading });

  useEffect(() => {
    if (!process.item) return navigate(strategyRedirect);
  }, []);

  const checkboxHandler = () => {
    setIsChecked(!isChecked);
  };

  const submitForm = async () => {
    setIsLoading(true);
    const isRemoved = await operatorStore.removeOperator({ operatorId: Number(process.item.id), isContractWallet, dispatch });
    setIsLoading(false);
    if (isRemoved) {
      await dispatch(fetchOperators({ forcePage: 1 }));
      if (!isContractWallet) {
        navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);
      }
    }
  };

  return (
    <Grid container item>
      <NewWhiteWrapper type={1} header={'Operator Details'}/>
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
              <CheckBox toggleIsChecked={checkboxHandler} isChecked={isChecked}
                        text={'I understand that by removing my operator I am potentially putting all of my managed validators at risk.'}/>

              <ErrorButton isLoading={isLoading} isDisabled={!isChecked} text={'Remove Operator'} onClick={submitForm} size={ButtonSize.XL}/>
            </Grid>,
          ]}
        />
      </Grid>
    </Grid>
  );
};

export default observer(RemoveOperator);
