import { observer } from 'mobx-react';
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// import TextInput from '~app/components/common/TextInput';
// import ErrorMessage from '~app/components/common/ErrorMessage';
// import LinkText from '~app/components/common/LinkText/LinkText';
// import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import { useStyles } from './FundingNewValidator.styles';
import TextInput from '~app/components/common/TextInput';
import ToolTip from '~app/components/common/ToolTip/ToolTip';
import BorderScreen from '~app/components/common/BorderScreen';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import PrimaryButton from '~app/components/common/Button/PrimaryButton/PrimaryButton';
import ProcessStore, { SingleClusterProcess } from '~app/common/stores/applications/SsvWeb/Process.store';

const FundingNewValidator = () => {
  const stores = useStores();
  const classes = useStyles();
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const [checkedId, setCheckedId] = useState(1);
  const process: SingleClusterProcess = processStore.getProcess;
  const cluster = process.item;
  const [customPeriod, setCustomPeriod] = useState(0);
  console.log(JSON.parse(JSON.stringify(process)));
  customPeriod;
  const options = [
    { id: 1, timeText: 'No - use current balance' },
    { id: 2, timeText: 'Yes - deposit additional funds' },
  ];

  const checkBox = (id: number) => setCheckedId(id);
  const isChecked = (id: number) => checkedId === id;


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
                          className={classes.Bold}>{formatNumberToUi(walletStore.fromWei(cluster.balance))}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container item className={classes.FieldBox}
                        style={{ borderTop: 'none', borderRadius: '0px 0px 8px 8px' }}>
                    <Grid container item alignItems={'center'} style={{ gap: 10 }}>
                      <Typography className={classes.LightGreyHeader}>Operational Runway</Typography>
                      <ToolTip classExtend={classes.ToolTip} text={'asdasd'}/>
                    </Grid>
                    <Grid container item style={{ gap: 8 }}>
                      <Typography
                          className={`${classes.Bold} ${classes.LessBold}`}>{formatNumberToUi(cluster.runWay, true)}</Typography>
                      <Typography className={classes.DaysText}>days</Typography>
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
                        {isCustom && <TextInput onChangeCallback={(e: any) => setCustomPeriod(Number(e.target.value))}
                                                extendClass={classes.DaysInput} withSideText/>}
                      </Grid>;
                    })}
                  </Grid>
                  <Grid container style={{ marginTop: 24 }}>
                    <PrimaryButton text={'Next'} submitFunction={console.log}/>
                  </Grid>
                  {/*<ErrorMessage extendClasses={classes.ErrorBox} text={*/}
                  {/*  <Grid container style={{ gap: 8 }}>*/}
                  {/*    <Grid item>*/}
                  {/*      Insufficient SSV balance. Acquire further SSV or pick a different amount.*/}
                  {/*    </Grid>*/}
                  {/*    <Grid container item xs>*/}
                  {/*      <LinkText className={classes.Link} text={'Need SSV?'} link={'https://faucet.ssv.network'}/>*/}
                  {/*    </Grid>*/}
                  {/*  </Grid>*/}
                  {/*}*/}
                  {/*/>*/}
                </Grid>
              </Grid>,
            ]}
        />
      </Grid>
  );
};
export default observer(FundingNewValidator);
