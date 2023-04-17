import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import LinkText from '~app/components/common/LinkText';
import { useStyles } from './FundingNewValidator.styles';
import TextInput from '~app/components/common/TextInput';
import ToolTip from '~app/components/common/ToolTip/ToolTip';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import PrimaryButton from '~app/components/common/Button/PrimaryButton/PrimaryButton';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';

const FundingNewValidator = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const clusterStore: ClusterStore = stores.Cluster;
  const process: SingleCluster = processStore.getProcess;
  const [checkedId, setCheckedId] = useState(0);
  const [depositSSV, setDepositSSV] = useState(0);
  const cluster = process.item;
  const newBurnRate = clusterStore.getClusterNewBurnRate(cluster, cluster.validator_count + 1);
  const newRunWay = clusterStore.getClusterRunWay({
    ...cluster,
    burnRate: walletStore.toWei(parseFloat(newBurnRate.toString())),
    balance: walletStore.toWei(walletStore.fromWei(cluster.balance) + depositSSV),
  });

  const options = [
    { id: 1, timeText: 'No - use current balance' },
    { id: 2, timeText: 'Yes - deposit additional funds' },
  ];

  const checkBox = (id: number) => {
    if (id === 1) setDepositSSV(0);
    setCheckedId(id);
  };

  const isChecked = (id: number) => checkedId === id;

  const daysChanged = () => {
    if (cluster.runWay > newRunWay) return <Typography
        className={classes.NegativeDays}>(-{formatNumberToUi(cluster.runWay - newRunWay, true)} days)</Typography>;
    return <Typography
        className={classes.PositiveDays}>(+{formatNumberToUi(newRunWay - cluster.runWay, true)} days)</Typography>;
  };

  const ssvChanged = () => {
    if (depositSSV > 0) return <Typography className={classes.PositiveDays}>(+{depositSSV} SSV)</Typography>;
  };

  const moveToNextPage = () => {
    process.registerValidator = { depositAmount: depositSSV };
    navigate(config.routes.SSV.VALIDATOR.ACCOUNT_BALANCE_AND_FEE);
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
                          className={classes.Bold}>{formatNumberToUi(walletStore.fromWei(cluster.balance))} SSV</Typography>
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
                          className={`${classes.Bold} ${classes.LessBold}`}>{formatNumberToUi(newRunWay, true)}</Typography>
                      <Typography className={classes.DaysText}>days</Typography>
                      <Typography className={`${classes.Bold} ${classes.LessBold}`}>{daysChanged()}</Typography>
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
                        {isCustom && <TextInput value={depositSSV || ''}
                                                placeHolder={'0'}
                                                onChangeCallback={(e: any) => setDepositSSV(Number(e.target.value))}
                                                extendClass={classes.DaysInput} withSideText />}
                      </Grid>;
                    })}
                  </Grid>
                  {depositSSV > ssvStore.walletSsvBalance && <Grid container style={{ marginTop: 24 }}>
                    <ErrorMessage extendClasses={classes.ErrorBox} text={
                      <Grid container style={{ gap: 8 }}>
                        <Grid item>
                          Insufficient SSV balance. Acquire further SSV or pick a different amount.
                        </Grid>
                        <Grid container item xs>
                          <LinkText className={classes.Link} text={'Need SSV?'} link={'https://faucet.ssv.network'}/>
                        </Grid>
                      </Grid>
                    }
                    />
                  </Grid>
                  }
                  <Grid container style={{ marginTop: 24 }}>
                    <PrimaryButton disable={depositSSV > ssvStore.walletSsvBalance || !checkedId} text={'Next'}
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
