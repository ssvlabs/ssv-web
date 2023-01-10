import React, { useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextInput from '~app/components/common/TextInput';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import LinkText from '~app/components/common/LinkText/LinkText';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/FundingPeriod/FundingPeriod.styles';

const FundingPeriod = () => {
  const classes = useStyles();
  const [checkedId, setCheckedId] = useState(1);
  const [customPeriod, setCustomPeriod] = useState(0);
  const options = [
    { id: 1, timeText: '6 Months', priceText: '75' },
    { id: 2, timeText: '1 Year', priceText: '150' },
    { id: 3, timeText: 'Custom Period', priceText: '' },
  ];

  const payments = [
    { name: 'Operator fee' },
    { name: 'Network fee' },
    { name: 'Liquidation collateral' },
  ];

  const checkBox = (id: number) => {
    setCheckedId(id);
  };

  const isChecked = (id: number) => checkedId === id;


  return (
    <BorderScreen
      blackHeader
      withConversion
      header={'Select your validator funding period'}
      body={[
        <Grid container>
          <Typography className={classes.Text}>The SSV amount you deposit will determine your validator operational runway
            (You can always manage it later by withdrawing or depositing more funds).</Typography>
          <Grid container item style={{ gap: 16 }}>
            {options.map((option, index) => {
              const isCustom = option.id === 3;
              const ssvValue = isCustom ? customPeriod : option.priceText;
              return <Grid key={index} container item className={`${classes.Box} ${isChecked(option.id) ? classes.SelectedBox : ''}`}
                           onClick={() => checkBox(option.id)}>
                <Grid container item xs style={{ gap: 16, alignItems: 'center' }}>
                  {isChecked(option.id) ? <Grid item className={classes.CheckedCircle}/> :
                      <Grid item className={classes.CheckCircle}/>}
                  <Grid item className={isChecked(option.id) ? classes.SsvPrice : classes.TimeText}>{option.timeText}</Grid>
                </Grid>
                <Grid item className={classes.SsvPrice}>{ssvValue} SSV</Grid>
                {isCustom && <TextInput onChangeCallback={(e: any) => setCustomPeriod(Number(e.target.value))} extendClass={classes.DaysInput} withSideText sideText={'Days'}/>}
              </Grid>;
            })}
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
        </Grid>,
        <Grid container>
          <Typography className={classes.GreyHeader}>Funding Summary</Typography>
          {payments.map((payment: { name: string }, index: number) => {
            return <Grid key={index} container item>
              <Grid container item xs style={{ gap: 8, marginBottom: index !== 2 ? 8 : 0 }}>
                <Grid item>
                  <Typography className={classes.Text} style={{ marginBottom: 0 }}>{payment.name}</Typography>
                </Grid>
                <Grid item>
                  <Typography className={`${classes.GreyHeader} ${classes.BiggerFont}`}>x 182 Days</Typography>
                </Grid>
              </Grid>
              <Grid item xs>
                <Typography className={classes.Text} style={{ textAlign: 'right', marginBottom: 0 }}>50 SSV</Typography>
              </Grid>
            </Grid>;
          })}
        </Grid>,
        <Grid container>
          <Grid container item style={{ justifyContent: 'space-between', marginTop: -8, marginBottom: 20 }}>
            <Typography className={classes.Text} style={{ marginBottom: 0 }}>Total</Typography>
            <Typography className={classes.SsvPrice} style={{ marginBottom: 0 }}>50 SSV</Typography>
          </Grid>
         <PrimaryButton text={'Next'} submitFunction={console.log} />
        </Grid>,
      ]}
    />
  );
};
export default observer(FundingPeriod);
