import { ChangeEvent, useEffect, useState } from 'react';
import { isFinite } from 'lodash';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import LinkText from '~app/components/common/LinkText';
import { useStyles } from './FundingNewValidator.styles';
import TextInput from '~app/components/common/TextInput';
import config, { translations } from '~app/common/config';
import ToolTip from '~app/components/common/ToolTip/ToolTip';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import { fromWei, toWei } from '~root/services/conversions.service';
import { ValidatorStore } from '~app/common/stores/applications/SsvWeb';
import useValidatorRegistrationFlow from '~app/hooks/useValidatorRegistrationFlow';
import NewWhiteWrapper, { WhiteWrapperDisplayType } from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import { getClusterNewBurnRate, getClusterRunWay } from '~root/services/cluster.service';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import { PrimaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getNetworkFeeAndLiquidationCollateral } from '~app/redux/network.slice';
import useFetchWalletBalance from '~app/hooks/useFetchWalletBalance';
import { getSelectedCluster } from '~app/redux/account.slice.ts';
import { NewValidatorRouteState } from '~app/Routes';

const FundingNewValidator = () => {
  const [checkedId, setCheckedId] = useState(0);
  const [depositSSV, setDepositSSV] = useState<string | number>(0);
  const [errorMessage, setErrorMessage] = useState({
    text: '',
    disableButton: false,
    link: { text: '', path: '' }
  });
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { networkFee, liquidationCollateralPeriod, minimumLiquidationCollateral } = useAppSelector(getNetworkFeeAndLiquidationCollateral);
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const OPTION_USE_CURRENT_BALANCE = 1;
  const { walletSsvBalance } = useFetchWalletBalance();
  const OPTION_DEPOSIT_ADDITIONAL_FUNDS = 2;
  const validatorStore: ValidatorStore = stores.Validator;
  const cluster = useAppSelector(getSelectedCluster);
  const newValidatorsCount = validatorStore.validatorsCount ? validatorStore.validatorsCount : 1;
  const newBurnRate = getClusterNewBurnRate(cluster.operators, cluster.validatorCount + newValidatorsCount, networkFee);
  const newRunWay = getClusterRunWay(
    {
      ...cluster,
      burnRate: toWei(parseFloat(newBurnRate.toString())),
      balance: toWei(fromWei(cluster.balance) + Number(depositSSV))
    },
    liquidationCollateralPeriod,
    minimumLiquidationCollateral
  );
  const calculateNewRunWayCondition = checkedId === OPTION_DEPOSIT_ADDITIONAL_FUNDS ? Number(depositSSV) > 0 : true;
  const runWay =
    checkedId === OPTION_USE_CURRENT_BALANCE || (checkedId === OPTION_DEPOSIT_ADDITIONAL_FUNDS && Number(depositSSV) > 0)
      ? formatNumberToUi(newRunWay, true)
      : formatNumberToUi(cluster.runWay, true);
  const disableBtnCondition = (Number(depositSSV) === 0 && checkedId === OPTION_DEPOSIT_ADDITIONAL_FUNDS) || !checkedId || newRunWay < 1 || errorMessage.disableButton;
  const { getNextNavigation } = useValidatorRegistrationFlow(window.location.pathname);

  useEffect(() => {
    if (checkedId === OPTION_DEPOSIT_ADDITIONAL_FUNDS && Number(depositSSV) === 0) {
      setErrorMessage({
        text: '',
        disableButton: false,
        link: { text: '', path: '' }
      });
      setShowErrorMessage(false);
      return;
    }
    if (Number(depositSSV) > walletSsvBalance) {
      setErrorMessage({
        text: 'Insufficient SSV balance. Acquire further SSV or pick a different amount.',
        disableButton: true,
        link: {
          text: 'Need SSV?',
          path: getStoredNetwork().insufficientBalanceUrl
        }
      });
      setShowErrorMessage(true);
      return;
    }
    if (newRunWay < config.GLOBAL_VARIABLE.CLUSTER_VALIDITY_PERIOD_MINIMUM) {
      setErrorMessage({
        text: 'Your updated operational puts your cluster validators at risk. To avoid liquidation please top up your cluster balance with greater funds.',
        disableButton: false,
        link: {
          text: 'Learn more on liquidations',
          path: config.links.MORE_ON_LIQUIDATION_LINK
        }
      });
      setShowErrorMessage(true);
      return;
    }
    setErrorMessage({
      text: '',
      disableButton: false,
      link: { text: '', path: '' }
    });
    setShowErrorMessage(false);
  }, [depositSSV, checkedId]);

  const options = [
    { id: OPTION_USE_CURRENT_BALANCE, timeText: 'No - use current balance' },
    {
      id: OPTION_DEPOSIT_ADDITIONAL_FUNDS,
      timeText: 'Yes - deposit additional funds'
    }
  ];

  const checkBox = (id: number) => {
    if (id === OPTION_USE_CURRENT_BALANCE) setDepositSSV(0);
    setCheckedId(id);
  };

  const isChecked = (id: number) => checkedId === id;

  const daysChanged = () => {
    if (!isFinite(cluster.runWay)) return <Typography className={classes.PositiveDays}>(+{formatNumberToUi(newRunWay, true)} days)</Typography>;
    if (cluster.runWay > newRunWay) return <Typography className={classes.NegativeDays}>(-{formatNumberToUi(cluster.runWay - newRunWay, true)} days)</Typography>;
    return <Typography className={classes.PositiveDays}>(+{formatNumberToUi(newRunWay - cluster.runWay, true)} days)</Typography>;
  };

  const ssvChanged = () => {
    if (Number(depositSSV) > 0) return <Typography className={classes.PositiveDays}>(+{depositSSV} SSV)</Typography>;
  };

  const moveToNextPage = () => {
    navigate(getNextNavigation(), { state: { newValidatorDepositAmount: Number(depositSSV) } satisfies NewValidatorRouteState });
  };

  const changeDepositSsvHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9.]/g, '').trim();
    const finalValue = value.toString().includes('.') ? value : Number(value);
    setDepositSSV(finalValue);
  };

  return (
    <Grid container>
      <NewWhiteWrapper type={WhiteWrapperDisplayType.VALIDATOR} header={'Cluster'} />
      <BorderScreen
        blackHeader
        withConversion
        withoutNavigation
        header={translations.VALIDATOR.FUNDING_NEW_VALIDATOR.HEADER_TEXT}
        body={[
          <Grid container>
            <Typography className={classes.Text}>Adding a new validator increases your operational costs and decreases the cluster's operational runway.</Typography>
            <Grid container item>
              <Typography className={classes.BoldGray} style={{ marginBottom: 16 }}>
                Would you like to top - up your balance?
              </Typography>
              <Grid container item className={classes.FieldBox} style={{ borderTop: '', borderRadius: '8px 8px 0px 0px' }}>
                <Grid container item alignItems={'center'} style={{ gap: 10 }}>
                  <Typography className={classes.GreyHeader}>Cluster Balance</Typography>
                </Grid>
                <Grid container item style={{ gap: 8 }}>
                  <Typography className={classes.Bold}>{formatNumberToUi(fromWei(cluster.balance))} SSV</Typography>
                  <Typography className={`${classes.Bold} ${classes.LessBold}`}>{ssvChanged()}</Typography>
                </Grid>
              </Grid>
              <Grid container item className={classes.FieldBox} style={{ borderTop: 'none', borderRadius: '0px 0px 8px 8px' }}>
                <Grid container item alignItems={'center'} style={{ gap: 10 }}>
                  <Typography className={classes.LightGreyHeader}>Est. Operational Runway</Typography>
                  <ToolTip classExtend={classes.ToolTip} text={'Estimated amount of days the cluster balance is sufficient to run all it’s validator'} />
                </Grid>
                <Grid container item style={{ gap: 8, alignItems: 'center' }}>
                  <Typography className={`${classes.Bold} ${classes.LessBold}`}>{runWay}</Typography>
                  <Typography className={classes.DaysText}>days</Typography>
                  {checkedId > 0 && calculateNewRunWayCondition && <Typography className={`${classes.Bold} ${classes.LessBold}`}>{daysChanged()}</Typography>}
                </Grid>
              </Grid>
              <Grid container style={{ marginTop: 16, gap: 16 }}>
                {options.map((option, index) => {
                  const isCustom = option.id === 2;
                  return (
                    <Grid key={index} container item className={`${classes.OptionBox} ${isChecked(option.id) ? classes.SelectedBox : ''}`} onClick={() => checkBox(option.id)}>
                      <Grid container item xs style={{ gap: 16, alignItems: 'center' }}>
                        <Grid item className={isChecked(option.id) ? classes.CheckedCircle : classes.CheckCircle} />
                        <Grid item className={classes.TimeText}>
                          {option.timeText}
                        </Grid>
                      </Grid>
                      {isCustom && <TextInput value={depositSSV} onChangeCallback={changeDepositSsvHandler} extendClass={classes.DaysInput} withSideText />}
                    </Grid>
                  );
                })}
              </Grid>
              {showErrorMessage && checkedId > 0 && (
                <Grid container style={{ marginTop: 24 }}>
                  <ErrorMessage
                    extendClasses={classes.ErrorBox}
                    text={
                      <Grid container style={{ gap: 8 }}>
                        <Grid item>{errorMessage.text}</Grid>
                        <Grid container item xs>
                          <LinkText className={classes.Link} text={errorMessage.link.text} link={errorMessage.link.path} />
                        </Grid>
                      </Grid>
                    }
                  />
                </Grid>
              )}
              <Grid container style={{ marginTop: 24 }}>
                <PrimaryButton isDisabled={disableBtnCondition} text={'Next'} onClick={moveToNextPage} size={ButtonSize.XL} />
              </Grid>
            </Grid>
          </Grid>
        ]}
      />
    </Grid>
  );
};
export default observer(FundingNewValidator);
