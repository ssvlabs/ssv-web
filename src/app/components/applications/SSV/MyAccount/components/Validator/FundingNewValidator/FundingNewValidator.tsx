import React, { ChangeEvent, useEffect, useState } from 'react';
import { isFinite } from 'lodash';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { ENV } from '~lib/utils/envHelper';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import LinkText from '~app/components/common/LinkText';
import { useStyles } from './FundingNewValidator.styles';
import TextInput from '~app/components/common/TextInput';
import ToolTip from '~app/components/common/ToolTip/ToolTip';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import PrimaryButton from '~app/components/common/Button/PrimaryButton/PrimaryButton';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import { fromWei, toWei } from '~root/services/conversions.service';

const FundingNewValidator = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const OPTION_USE_CURRENT_BALANCE = 1;
  const ssvStore: SsvStore = stores.SSV;
  const OPTION_DEPOSIT_ADDITIONAL_FUNDS = 2;
  const processStore: ProcessStore = stores.Process;
  const clusterStore: ClusterStore = stores.Cluster;
  const process: SingleCluster = processStore.getProcess;
  const [checkedId, setCheckedId] = useState(0);
  const [depositSSV, setDepositSSV] = useState<string | number>(0);
  const [errorMessage, setErrorMessage] = useState({ text:'', link: { text:'', path:'' } });
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const cluster = process.item;
  const newBurnRate = clusterStore.getClusterNewBurnRate(cluster, cluster.validator_count + 1);
  const newRunWay = clusterStore.getClusterRunWay({
    ...cluster,
    burnRate: toWei(parseFloat(newBurnRate.toString())),
    balance: toWei(fromWei(cluster.balance) + Number(depositSSV)),
  });
  const calculateNewRunWayCondition = checkedId === OPTION_DEPOSIT_ADDITIONAL_FUNDS ? Number(depositSSV) > 0 : true;
  const runWay = checkedId === OPTION_USE_CURRENT_BALANCE || checkedId === OPTION_DEPOSIT_ADDITIONAL_FUNDS && Number(depositSSV) > 0 ? formatNumberToUi(newRunWay, true) : formatNumberToUi(cluster.runWay, true);
  const disableBtnCondition = (Number(depositSSV) === 0 && checkedId === OPTION_DEPOSIT_ADDITIONAL_FUNDS) || !checkedId || newRunWay < 1;

  useEffect(() => {
    if (checkedId === OPTION_DEPOSIT_ADDITIONAL_FUNDS && Number(depositSSV) === 0) {
      setErrorMessage({ text:'', link: { text:'', path:'' } });
      setShowErrorMessage(false);
      return;
    }
    if (Number(depositSSV) > ssvStore.walletSsvBalance) {
      setErrorMessage({
        text: 'Insufficient SSV balance. Acquire further SSV or pick a different amount.',
        link: {
          text: 'Need SSV?',
          path: ENV().INSUFFICIENT_BALANCE_URL,
        },
      });
      setShowErrorMessage(true);
      return;
    }
    if ( newRunWay < config.GLOBAL_VARIABLE.CLUSTER_VALIDITY_PERIOD_MINIMUM ) {
      setErrorMessage({
        text: 'Your updated operational puts your cluster validators at risk. To avoid liquidation please top up your cluster balance with greater funds.',
        link: {
          text: 'Learn more on liquidations',
          path: config.links.MORE_ON_LIQUIDATION_LINK,
        },
      });
      setShowErrorMessage(true);
      return;
    }
    setErrorMessage({ text:'', link: { text:'', path:'' } });
    setShowErrorMessage(false);
  }, [depositSSV, checkedId]);

  const options = [
    { id: OPTION_USE_CURRENT_BALANCE, timeText: 'No - use current balance' },
    { id: OPTION_DEPOSIT_ADDITIONAL_FUNDS, timeText: 'Yes - deposit additional funds' },
  ];

  const checkBox = (id: number) => {
    if (id === OPTION_USE_CURRENT_BALANCE) setDepositSSV(0);
    setCheckedId(id);
  };

  const isChecked = (id: number) => checkedId === id;

  const daysChanged = () => {
    if (!isFinite(cluster.runWay)) return <Typography
        className={classes.PositiveDays}>(+{formatNumberToUi(newRunWay, true)} days)</Typography>;
    if (cluster.runWay > newRunWay) return <Typography
        className={classes.NegativeDays}>(-{formatNumberToUi(cluster.runWay - newRunWay, true)} days)</Typography>;
    return <Typography
        className={classes.PositiveDays}>(+{formatNumberToUi(newRunWay - cluster.runWay, true)} days)</Typography>;
  };

  const ssvChanged = () => {
    if (Number(depositSSV) > 0) return <Typography className={classes.PositiveDays}>(+{depositSSV} SSV)</Typography>;
  };

  const moveToNextPage = () => {
    process.registerValidator = { depositAmount: Number(depositSSV) };
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.DISTRIBUTION_METHOD_START);
  };

  const changeDepositSsvHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9.]/g, '').trim();
    const finalValue = value.toString().includes('.') ? value : Number(value);
    setDepositSSV(finalValue);
  };

  return (
      <Grid container>
        <NewWhiteWrapper
            type={0}
            header={'Cluster'}
        />
        <BorderScreen
            blackHeader
            withConversion
            withoutNavigation
            header={'Add Validator'}
            body={[
              <Grid container>
                <Typography className={classes.Text}>Adding a new validator increases your operational costs and
                  decreases the cluster's operational runway.</Typography>
                <Grid container item>
                  <Typography className={classes.BoldGray} style={{ marginBottom: 16 }}>Would you like to top - up your
                    balance?</Typography>
                  <Grid container item className={classes.FieldBox}
                        style={{ borderTop: '', borderRadius: '8px 8px 0px 0px' }}>
                    <Grid container item alignItems={'center'} style={{ gap: 10 }}>
                      <Typography className={classes.GreyHeader}>Cluster Balance</Typography>
                    </Grid>
                    <Grid container item style={{ gap: 8 }}>
                      <Typography
                          className={classes.Bold}>{formatNumberToUi(fromWei(cluster.balance))} SSV</Typography>
                      <Typography className={`${classes.Bold} ${classes.LessBold}`}>{ssvChanged()}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container item className={classes.FieldBox}
                        style={{ borderTop: 'none', borderRadius: '0px 0px 8px 8px' }}>
                    <Grid container item alignItems={'center'} style={{ gap: 10 }}>
                      <Typography className={classes.LightGreyHeader}>Est. Operational Runway</Typography>
                      <ToolTip classExtend={classes.ToolTip}
                               text={'Estimated amount of days the cluster balance is sufficient to run all it’s validator'}/>
                    </Grid>
                    <Grid container item style={{ gap: 8, alignItems: 'center' }}>
                      <Typography
                          className={`${classes.Bold} ${classes.LessBold}`}>{runWay}</Typography>
                      <Typography className={classes.DaysText}>days</Typography>
                      {checkedId > 0 && calculateNewRunWayCondition && <Typography className={`${classes.Bold} ${classes.LessBold}`}>{daysChanged()}</Typography>}
                    </Grid>
                  </Grid>
                  <Grid container style={{ marginTop: 16, gap: 16 }}>
                    {options.map((option, index) => {
                      const isCustom = option.id === 2;
                      return <Grid key={index} container item
                                   className={`${classes.OptionBox} ${isChecked(option.id) ? classes.SelectedBox : ''}`}
                                   onClick={() => checkBox(option.id)}>
                        <Grid container item xs style={{ gap: 16, alignItems: 'center' }}>
                          {isChecked(option.id) ? <Grid item className={classes.CheckedCircle}/> :
                              <Grid item className={classes.CheckCircle}/>}
                          <Grid item className={classes.TimeText}>{option.timeText}</Grid>
                        </Grid>
                        {isCustom && <TextInput value={depositSSV}
                                                onChangeCallback={changeDepositSsvHandler}
                                                extendClass={classes.DaysInput} withSideText />}
                      </Grid>;
                    })}
                  </Grid>
                  {showErrorMessage && checkedId > 0 && <Grid container style={{ marginTop: 24 }}>
                    <ErrorMessage extendClasses={classes.ErrorBox} text={
                      <Grid container style={{ gap: 8 }}>
                        <Grid item>
                          {errorMessage.text}
                        </Grid>
                        <Grid container item xs>
                          <LinkText className={classes.Link} text={errorMessage.link.text} link={errorMessage.link.path}/>
                        </Grid>
                      </Grid>
                    }
                    />
                  </Grid>
                  }
                  <Grid container style={{ marginTop: 24 }}>
                    <PrimaryButton disable={disableBtnCondition} text={'Next'}
                                   submitFunction={moveToNextPage}/>
                  </Grid>
                </Grid>
              </Grid>,
            ]}
        />
      </Grid>
  );
};
export default observer(FundingNewValidator);
