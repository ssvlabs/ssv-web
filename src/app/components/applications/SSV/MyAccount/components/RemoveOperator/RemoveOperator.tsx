import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorButton from '~app/atomicComponents/ErrorButton';
import config from '~app/common/config';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/RemoveOperator/RemoveOperator.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import CheckBox from '~app/components/common/CheckBox';
import NewWhiteWrapper, { WhiteWrapperDisplayType } from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { fetchOperators, getSelectedOperator } from '~app/redux/account.slice';
import { getStrategyRedirect } from '~app/redux/navigation.slice';
import { getIsContractWallet } from '~app/redux/wallet.slice';
import { removeOperator } from '~root/services/operatorContract.service';

const RemoveOperator = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const operator = useAppSelector(getSelectedOperator);
  const dispatch = useAppDispatch();
  const strategyRedirect = useAppSelector(getStrategyRedirect);
  const isContractWallet = useAppSelector(getIsContractWallet);
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles({ isLoading });

  useEffect(() => {
    if (!operator) return navigate(strategyRedirect);
  }, []);

  const checkboxHandler = () => {
    setIsChecked(!isChecked);
  };

  const submitForm = async () => {
    setIsLoading(true);
    const isRemoved = await removeOperator({ operatorId: Number(operator?.id), isContractWallet, dispatch });
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
      <NewWhiteWrapper type={WhiteWrapperDisplayType.OPERATOR} header={'Operator Details'} />
      <Grid className={classes.BodyWrapper}>
        <BorderScreen
          marginTop={0}
          withoutNavigation
          header={'Remove operator'}
          body={[
            <Grid container item>
              <Grid item className={classes.BulletsWrapper}>
                <ul>
                  <li>Removing your operator will cease your operation of all your managed validators, which will reduce their fault tolerance and put them at risk.</li>
                  <li>Immediately stop receiving future earnings from managed validators operation.</li>
                  <li>Remove yourself from the network and you will not longer be discoverable by other validators.</li>
                </ul>
              </Grid>
              <Grid item className={classes.Notice}>
                Please note that this process is irreversible and you would not be able to reactive this operator in the future.
              </Grid>
              <CheckBox
                toggleIsChecked={checkboxHandler}
                isChecked={isChecked}
                text={'I understand that by removing my operator I am potentially putting all of my managed validators at risk.'}
              />

              <ErrorButton isLoading={isLoading} isDisabled={!isChecked} text={'Remove Operator'} onClick={submitForm} size={ButtonSize.XL} />
            </Grid>
          ]}
        />
      </Grid>
    </Grid>
  );
};

export default RemoveOperator;
