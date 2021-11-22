import { observer } from 'mobx-react';
import styled from 'styled-components';
import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import useUserFlow from '~app/hooks/useUserFlow';
import CTAButton from '~app/common/components/CTAButton';
import config, { translations } from '~app/common/config';
import NameAndAddress from '~app/common/components/NameAndAddress';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import ValidatorDropDownMenu from '~app/components/MyAccount/components/EnableAccount/Components/ValidatorDropDownMenu/ValidatorDropDownMenu';
import { useStyles } from './EnableAccount.styles';

const Title = styled.div`
  height: 18px;
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  margin-bottom: 8px;
  letter-spacing: normal;
  color: #a1acbe;
`;

const EnableAccount = () => {
    const classes = useStyles();
    const { redirectUrl, history } = useUserFlow();
    const validators = [
        { name: 'Validator1', pubkey: '0xb510...42b7' },
        { name: 'Validator2', pubkey: '0xb510...42b7' },
        { name: 'Validator3', pubkey: '0xb510...42b7' },
    ];
    const summaryFields = [
        { name: 'Operators yearly fee', value: '884' },
        { name: 'Network yearly fee', value: '30' },
        { name: 'Liquidation collateral', value: '23' },
    ];

    useEffect(() => {
        redirectUrl && history.push(redirectUrl);
    }, [redirectUrl]);

    return (
      <div>
        <BorderScreen
          withConversion
          header={'Enable Account'}
          link={{ to: config.routes.MY_ACCOUNT.DASHBOARD, text: translations.MY_ACCOUNT.DEPOSIT.NAVIGATION_TEXT }}
          body={[
                    (
                      <Grid container>
                        <Grid item container className={classes.WarningWrapper}>
                          <Grid item>
                            Your account has been <a href={'www.bla.com'}>liquidated</a> due to insufficient balance for
                            its maintenance. If you would like to resume its operations, you must deposit sufficient
                            balance required for reactivation.
                          </Grid>
                          <Grid item>
                            <a href={'www.bla.com'}>Read more on account reactivation</a>
                          </Grid>
                        </Grid>
                        <Grid item container>
                          <Grid item>
                            <Title>OPERATORS FEES DETAILS</Title>
                          </Grid>
                          <Grid item container>
                            {validators.map((validator: any, index: number) => {
                                        return (
                                          <ValidatorDropDownMenu key={index} validator={validator} />
                                        );
                                    })}
                          </Grid>
                        </Grid>
                        <Grid item container className={classes.SummarySectionWrapper}>
                          <Grid item xs={12}>
                            <Title>TRANSACTION SUMMARY</Title>
                          </Grid>
                          {summaryFields.map((field: any, index: number) => {
                                  return (
                                    <Grid key={index} item container className={classes.SummaryField}>
                                      <Grid item>
                                        <NameAndAddress name={field.name} />
                                      </Grid>
                                      <Grid item className={classes.BoldField}>
                                        {field.value} SSV
                                      </Grid>
                                    </Grid>
                                  );
                              })}
                          <Grid container item justify={'space-between'}>
                            <Grid item>
                              <NameAndAddress styleWrapperClass={classes.TotalWrapper} name={'Total'}
                                styleNameClass={classes.GreenColor} />
                            </Grid>
                            <Grid item className={classes.AlignRight}>
                              <NameAndAddress styleWrapperClass={classes.TotalWrapper} name={`${540} SSV`}
                                styleNameClass={classes.GreenColor} address={'~$490'} />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    ),
                ]}
          bottom={(
            <Grid container className={classes.ButtonWrapper}>
              <Grid item xs>
                <CTAButton text={'Enable Account'} disable={false} onClick={() => { console.log('s'); }} withAllowance />
              </Grid>
            </Grid>
                )}
            />
      </div>
    );
};

export default observer(EnableAccount);