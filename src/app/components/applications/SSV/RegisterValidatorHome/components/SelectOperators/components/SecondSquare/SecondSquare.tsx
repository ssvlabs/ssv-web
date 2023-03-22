import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './SecondSquare.styles';
import { formatNumberToUi } from '~lib/utils/numbers';
import LinkText from '~app/components/common/LinkText';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorDetails
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import ErrorMessage from '~app/components/common/ErrorMessage';

const SecondSquare = ({ editPage }: { editPage: boolean }) => {
  const boxes = [1, 2, 3, 4];
  const stores = useStores();
  const classes = useStyles({ editPage });
  const navigate = useNavigate();
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const clusterStore: ClusterStore = stores.Cluster;
  const operatorStore: OperatorStore = stores.Operator;
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const [clusterExist, setClusterExist] = useState(false);
  const [previousOperatorsIds, setPreviousOperatorsIds] = useState([]);
  const [checkClusterExistence, setCheckClusterExistence] = useState(false);
  const [allSelectedOperatorsVerified, setAllSelectedOperatorsVerified] = useState(true);


  useEffect(() => {
    const process: SingleCluster = processStore.getProcess;
    if (editPage) {
      if (!process.item.publicKey) return navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD);
      myAccountStore.getValidator(process.item.publicKey).then((validator: any) => {
        if (validator?.operators) {
          // @ts-ignore
          setPreviousOperatorsIds(validator.operators.map(({ id }) => id));
        }
      });
    }
  }, [editPage]);

  const removeOperator = (index: number) => {
    operatorStore.unselectOperator(index);
  };

  const onSelectOperatorsClick = async () => {
    if (editPage) {
      navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.VALIDATOR_UPDATE.ENTER_KEYSTORE);
    } else {
      navigate(config.routes.SSV.VALIDATOR.FUNDING_PERIOD_PAGE);
    }
  };

  const linkToNotVerified = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'not verified',
    });
  };

  const disableButton = (): boolean => {
    return clusterExist || checkClusterExistence || !operatorStore.selectedEnoughOperators || !Object.values(operatorStore.selectedOperators).reduce((acc: boolean, operator: IOperator) => {
      // @ts-ignore
      if (!previousOperatorsIds.includes(operator.id)) acc = true;
      return acc;
    }, false);
  };

  useEffect(() => {
    const notVerifiedOperators = Object.values(operatorStore.selectedOperators).filter(operator => operator.type !== 'verified_operator' && operator.type !== 'dappnode');
    setAllSelectedOperatorsVerified(notVerifiedOperators.length === 0);
  }, [JSON.stringify(operatorStore.selectedOperators)]);

  useEffect(() => {
    if (operatorStore.selectedEnoughOperators) {
      setClusterExist(false);
      setCheckClusterExistence(true);
      clusterStore.getClusterData(clusterStore.getClusterHash(Object.values(operatorStore.selectedOperators))).then((clusterData) => {
        if (clusterData?.validatorCount !== 0) {
          setClusterExist(true);
        } else {
          setClusterExist(false);
        }
        setCheckClusterExistence(false);
      }).catch((error: any)=>{
        console.log('<<<<<<<<<<<<<<<<<<<error>>>>>>>>>>>>>>>>>>>');
        console.log(error);
        console.log('<<<<<<<<<<<<<<<<<<<error>>>>>>>>>>>>>>>>>>>');
      });
    } else {
      setCheckClusterExistence(false);
    }
  }, [operatorStore.selectedEnoughOperators]);

  return (
    <BorderScreen
      withoutNavigation
      wrapperClass={classes.ScreenWrapper}
      body={[
        <Grid container>
          <HeaderSubHeader title={'Selected Operators'} />
          <Grid container item className={classes.BoxesWrapper}>
            {boxes.map((index: number) => {
              if (operatorStore.selectedOperators[index]) {
                const operator = operatorStore.selectedOperators[index];
                return (
                  <Grid key={index} container className={classes.SelectedOperatorBox}>
                    <Grid className={classes.DeleteOperator} onClick={() => {
                      removeOperator(index);
                    }}><Grid className={classes.whiteLine} /></Grid>
                    <Grid item>
                      <OperatorDetails operator={operator} />
                    </Grid>
                    <Grid item>
                      <SsvAndSubTitle
                        ssv={formatNumberToUi(ssvStore.newGetFeeForYear(walletStore.fromWei(operator.fee)))} />
                    </Grid>
                  </Grid>
                );
              }
              return (
                <Grid key={index} item className={classes.BoxPlaceHolder}>Select Operator
                  0{index}</Grid>
              );
            })}
          </Grid>
          {editPage ? (
            <Grid container item xs={12} className={classes.AlertMessage}>
              <Grid item xs={12}>
                Updating operators is experimental and could result in slashing, please proceed at your own discretion.
              </Grid>
            </Grid>
          ) : ''}
          {clusterExist && <Grid item xs={12}><ErrorMessage text={'You already have this cluster registered, please go to “my account” and add from the cluster page'}/></Grid>}
          {!allSelectedOperatorsVerified && !clusterExist && (
            <Grid container item xs={12} className={classes.WarningMessage}>
              <Grid item xs={12} className={classes.WarningHeader}>
                You have selected one or more operators that are&nbsp;
                <LinkText
                    text={'not verified.'}
                    onClick={linkToNotVerified}
                    className={classes.NotVerifiedText}
                    link={'https://snapshot.org/#/mainnet.ssvnetwork.eth/proposal/QmbuDdbbm7Ygan8Qi8PWoGzN3NJCVmBJQsv2roUTZVg6CH'}
                />
              </Grid>
              <Grid item xs={12}>
                Unverified operators that were not reviewed and their identity is not confirmed, may pose a threat to
                your validators’ performance.
              </Grid>
              <Grid item xs={12}>
                Please proceed only if you know and trust these operators.
              </Grid>
            </Grid>
          )}
          <Grid container item xs={12} className={classes.TotalFeesWrapper}>
            <Grid item className={classes.TotalFeesHeader}>
              {editPage ? 'New Operators Yearly Fee' : 'Operators Yearly Fee'}
            </Grid>
            <Grid item>
              <SsvAndSubTitle
                bold
                fontSize={16}
                subTextCenter={false}
                ssv={formatNumberToUi(ssvStore.newGetFeeForYear(operatorStore.getSelectedOperatorsFee))}
              />
            </Grid>
          </Grid>
          <PrimaryButton dataTestId={'operators-selected-button'} disable={disableButton()} text={'Next'}
            submitFunction={onSelectOperatorsClick} />
        </Grid>,
      ]}
    />
  );
};

export default observer(SecondSquare);
