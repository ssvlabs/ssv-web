import { observer } from 'mobx-react';
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// import TextInput from '~app/components/common/TextInput';
import BorderScreen from '~app/components/common/BorderScreen';
// import ErrorMessage from '~app/components/common/ErrorMessage';
// import LinkText from '~app/components/common/LinkText/LinkText';
// import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/Validator/FundingNewValidator/FundingNewValidator.styles';
import ToolTip from '~app/components/common/ToolTip/ToolTip';
import TextInput from '~app/components/common/TextInput';
import PrimaryButton from '~app/components/common/Button/PrimaryButton/PrimaryButton';
type Field = {
  name: string,
  class: string,
  subHeaderClass: string,
};

const FundingNewValidator = () => {
  const classes = useStyles();
  const [checkedId, setCheckedId] = useState(1);
  const [customPeriod, setCustomPeriod] = useState(0);
  customPeriod;
  const options = [
    { id: 1, timeText: 'No - use current balance' },
    { id: 2, timeText: 'Yes - deposit additional funds' },
  ];

  const fields: Field[] = [
    { name: 'Cluster Balance', class: classes.GreyHeader, subHeaderClass: classes.Bold },
    { name: 'Operational Runway', class: classes.LightGreyHeader, subHeaderClass: `${classes.Bold} ${classes.LessBold}` },
  ];

  const checkBox = (id: number) => {
    setCheckedId(id);
  };

  const isChecked = (id: number) => checkedId === id;


  return (
      <BorderScreen
          blackHeader
          withConversion
          withoutNavigation
          header={'Add Validator'}
          body={[
            <Grid container>
              <Typography className={classes.Text}>Adding a new validator to your cluster changes operational costs and runway.</Typography>
              <Grid container item>
                <Typography className={classes.BoldGray} style={{ marginBottom: 16 }}>Would you like to top - up your balance?</Typography>
                {fields.map((field: Field, index: number) => {
                  const last = index === 1;
                  return <Grid key={index} container item className={classes.FieldBox} style={{
                    borderTop: last ? 'none' : '',
                    borderRadius: last ? '0px 0px 8px 8px' : '8px 8px 0px 0px',
                  }}>
                    <Grid container item alignItems={'center'} style={{ gap: 10 }}>
                      <Typography className={field.class}>{field.name}</Typography>
                      {last && <ToolTip classExtend={classes.ToolTip} text={'asdasd'}/>}
                    </Grid>
                    <Grid container item style={{ gap: 8 }}>
                      <Typography className={field.subHeaderClass}>312 SSV</Typography>
                      {last && <Typography className={classes.DaysText}>days</Typography>}
                    </Grid>
                  </Grid>;
                })}
                <Grid container style={{ marginTop: 16, gap: 16 }}>
                  {options.map((option, index) => {
                    const isCustom = option.id === 2;
                    return <Grid key={index} container item className={`${classes.OptionBox} ${isChecked(option.id) ? classes.SelectedBox : ''}`}
                                 onClick={() => checkBox(option.id)}>
                      <Grid container item xs style={{ gap: 16, alignItems: 'center' }}>
                        {isChecked(option.id) ? <Grid item className={classes.CheckedCircle}/> :
                            <Grid item className={classes.CheckCircle}/>}
                        <Grid item className={classes.TimeText}>{option.timeText}</Grid>
                      </Grid>
                      {isCustom && <TextInput onChangeCallback={(e: any) => setCustomPeriod(Number(e.target.value))} extendClass={classes.DaysInput} withSideText/>}
                    </Grid>;
                  })}
                </Grid>
                <Grid container style={{ marginTop: 24 }}>
                  <PrimaryButton text={'Next'} submitFunction={console.log} />
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
  );
};
export default observer(FundingNewValidator);
