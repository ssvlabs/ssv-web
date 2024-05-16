import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { allEqual } from '~lib/utils/arrays';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './SecondSquare.styles';
import Typography from '@mui/material/Typography';
import { formatNumberToUi } from '~lib/utils/numbers';
import LinkText from '~app/components/common/LinkText';
import WarningBox from '~app/components/common/WarningBox';
import ErrorMessage from '~app/components/common/ErrorMessage';
import { MEV_RELAYS } from '~lib/utils/operatorMetadataHelper';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { useWindowSize, WINDOW_SIZES } from '~app/hooks/useWindowSize';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import validatorRegistrationFlow from '~app/hooks/useValidatorRegistrationFlow';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import MevIcon
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/MevBadge/MevIcon';
import OperatorDetails
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import { fromWei, getFeeForYear } from '~root/services/conversions.service';
import { getClusterData, getClusterHash } from '~root/services/cluster.service';
import { IOperator } from '~app/model/operator.model';
import { SingleCluster } from '~app/model/processes.model';
import { getFromLocalStorageByKey } from '~root/providers/localStorage.provider';
import { SKIP_VALIDATION } from '~lib/utils/developerHelper';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getAccountAddress } from '~app/redux/wallet.slice';
import { getValidator } from '~root/services/validator.service';
import { setSelectedClusterId } from '~app/redux/account.slice';
import { ICluster } from '~app/model/cluster.model';
import { getNetworkFeeAndLiquidationCollateral } from '~app/redux/network.slice';
import { PrimaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';

const SecondSquare = ({ editPage, clusterBox }: { editPage: boolean, clusterBox: number[] }) => {
  const { liquidationCollateralPeriod, minimumLiquidationCollateral } = useAppSelector(getNetworkFeeAndLiquidationCollateral);
  const stores = useStores();
  const classes = useStyles({ editPage, shouldBeScrollable: clusterBox.length > 4 });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { getNextNavigation } = validatorRegistrationFlow(location.pathname);
  const accountAddress = useAppSelector(getAccountAddress);
  const processStore: ProcessStore = stores.Process;
  const operatorStore: OperatorStore = stores.Operator;
  const windowSize = useWindowSize();
  const [existClusterData, setExistClusterData] = useState<ICluster | null>(null);
  const [previousOperatorsIds, setPreviousOperatorsIds] = useState<number[]>([]);
  const [checkClusterExistence, setCheckClusterExistence] = useState(false);
  const [allSelectedOperatorsVerified, setAllSelectedOperatorsVerified] = useState(true);
  const [operatorHasMaxCountValidators, setOperatorHasMaxCountValidators] = useState(false);
  const operatorHasMevRelays = allEqual(Object.values(operatorStore.selectedOperators), 'mev_relays');
  const operatorCount = Object.values(operatorStore.selectedOperators).length;
  const clusterSize = clusterBox.length;
  const secondSquareWidth = windowSize.size === WINDOW_SIZES.LG ? '100%' : 424;

  useEffect(() => {
    const process: SingleCluster = processStore.getProcess;
    if (editPage) {
      if (!process.item.publicKey) return navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD);
      getValidator(process.item.publicKey).then((validator: any) => {
        if (validator?.operators) {
          // @ts-ignore
          setPreviousOperatorsIds(validator.operators.map(({ id }) => id));
        }
      });
    }
  }, [editPage]);

  useEffect(() => {
    const notVerifiedOperators = Object.values(operatorStore.selectedOperators).filter(operator => operator.type !== 'verified_operator' && operator.type !== 'dappnode');
    const operatorReachedMaxValidators = Object.values(operatorStore.selectedOperators).some((operator: IOperator) => operatorStore.hasOperatorReachedValidatorLimit(operator.validators_count));
    setAllSelectedOperatorsVerified(notVerifiedOperators.length === 0);
    if (!getFromLocalStorageByKey(SKIP_VALIDATION)) {
      setOperatorHasMaxCountValidators(operatorReachedMaxValidators);
    }
  }, [JSON.stringify(operatorStore.selectedOperators)]);

  useEffect(() => {
    if (operatorStore.selectedEnoughOperators) {
      setExistClusterData(null);
      setCheckClusterExistence(true);
      getClusterData(getClusterHash(Object.values(operatorStore.selectedOperators), accountAddress), liquidationCollateralPeriod, minimumLiquidationCollateral, true).then((clusterData) => {
        if (clusterData?.validatorCount !== 0 || clusterData?.index > 0 || !clusterData?.active) {
          setExistClusterData(clusterData);
        }
        setCheckClusterExistence(false);
      }).catch((error: any) => {
        console.log(error);
      });
    } else {
      setCheckClusterExistence(false);
    }
  }, [operatorStore.selectedEnoughOperators]);

  const removeOperator = (index: number) => {
    operatorStore.unselectOperator(index);
  };

  const onSelectOperatorsClick = async () => {
    if (editPage) {
      navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.VALIDATOR_UPDATE.ENTER_KEYSTORE);
    } else {
      navigate(getNextNavigation());
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
    return operatorHasMaxCountValidators || !!existClusterData || checkClusterExistence || !operatorStore.selectedEnoughOperators || !Object.values(operatorStore.selectedOperators).every((operator: IOperator) => {
      return !previousOperatorsIds.includes(operator.id);
    });
  };

  const openSingleCluster = () => {
    processStore.setProcess({
      processName: 'single_cluster',
      item: { ...existClusterData, operators: [...Object.values(operatorStore.selectedOperators)] },
    }, 2);
    if (existClusterData) {
      dispatch(setSelectedClusterId(existClusterData.clusterId));
      navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.ROOT);
    }
  };

  return (
    <BorderScreen
      width={secondSquareWidth}
      marginTop={84}
      withoutNavigation
      wrapperClass={classes.ScreenWrapper}
      body={[
        <Grid className={classes.firstSectionWrapper}>
          <Grid container className={classes.firstSection}>
            <Grid className={classes.HeaderWrapper}>
              <HeaderSubHeader marginBottom={24} title={'Selected Operators'}/>
              <Typography
                className={classes.SelectedOperatorsIndicator}>{`${operatorCount}/${clusterSize}`}</Typography>
            </Grid>
            <Grid container item className={classes.BoxesWrapper}>
              <Grid className={classes.OperatorBoxesWrapper}>
                {clusterBox.map((index: number) => {
                  if (operatorStore.selectedOperators[index]) {
                    const operator = operatorStore.selectedOperators[index];
                    return (
                      <Grid key={index} container className={classes.SelectedOperatorBox}>
                        <Grid className={classes.DeleteOperator} onClick={() => {
                          removeOperator(index);
                          setOperatorHasMaxCountValidators(false);
                        }}><Grid className={classes.whiteLine}/></Grid>
                        <Grid item>
                          <OperatorDetails nameFontSize={14} idFontSize={12} logoSize={24} operator={operator}
                                           withoutExplorer/>
                        </Grid>
                        <Grid item className={classes.FeeAndMevRelaysWrapper}>
                          <SsvAndSubTitle fontSize={14}
                                          ssv={formatNumberToUi(getFeeForYear(fromWei(operator.fee)))}/>
                          <Grid className={classes.MevRelaysWrapper}>
                            {Object.values(MEV_RELAYS).map((mevRelay: string) => <MevIcon mevRelay={mevRelay}
                                                                                          key={mevRelay}
                                                                                          hasMevRelay={operator.mev_relays?.includes(mevRelay)}/>)}
                          </Grid>
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
            </Grid>
            {editPage ? (
              <Grid container item xs={12} className={classes.AlertMessage}>
                <Grid item xs={12}>
                  Updating operators is experimental and could result in slashing, please proceed at your own
                  discretion.
                </Grid>
              </Grid>
            ) : ''}
          </Grid>
        </Grid>,
        <Grid container>
          <Grid container item xs={12} className={classes.TotalFeesWrapper}>
            <Grid item className={classes.TotalFeesHeader}>
              {editPage ? 'New Operators Yearly Fee' : 'Operators Yearly Fee'}
            </Grid>
            <Grid item>
              <SsvAndSubTitle
                bold
                fontSize={16}
                subTextCenter={false}
                ssv={formatNumberToUi(getFeeForYear(operatorStore.getSelectedOperatorsFee))}
              />
            </Grid>
          </Grid>
          {existClusterData && (
            <Grid item xs={12}>
              <ErrorMessage text={
                <Grid item xs={12}>To register an additional validator to this cluster, navigate to this&nbsp;
                  <LinkText
                    text={'cluster page'}
                    onClick={openSingleCluster}/>
                  &nbsp;and click “Add Validator”.
                </Grid>}/>
            </Grid>
          )}
          {operatorHasMaxCountValidators && (
            <Grid item xs={12}>
              <ErrorMessage text={
                <Grid item xs={12}>One of your chosen operators has reached its maximum validator capacity. Please
                  select an alternative operator.
                </Grid>}/>
            </Grid>
          )}
          {!allSelectedOperatorsVerified && !existClusterData && (
            <Grid container item xs={12} className={classes.WarningMessage}>
              <Grid item xs={12} className={classes.WarningHeader}>
                You have selected one or more operators that are&nbsp;
                <LinkText
                  text={'not verified.'}
                  onClick={linkToNotVerified}
                  className={classes.NotVerifiedText}
                  link={'https://docs.ssv.network/learn/operators/verified-operators'}
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
          {!operatorHasMevRelays &&
            <WarningBox extendClass={classes.ExtendWarningClass} text={'Partial MEV Relay Correlation'}
                        textLink={'Learn more'}
                        link={'https://docs.ssv.network/learn/stakers/validators/validator-onboarding#_jm9n7m464k0'}/>}
          <PrimaryButton size={ButtonSize.XL} text={'Next'} isDisabled={disableButton()}
                         onClick={onSelectOperatorsClick}/>
        </Grid>,
      ]}
    />
  );
};

export default observer(SecondSquare);
