import React, { useState } from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import config, { translations } from '~app/common/config';
import Tooltip from '~app/common/components/Tooltip/Tooltip';
import IntegerInput from '~app/common/components/IntegerInput';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import { useStyles } from './Withdrew.styles';
import { getImage } from '~lib/utils/filePath';
import CTAButton from '~app/common/components/CTAButton/CTAButton';
// import { validateAddressInput } from '~lib/utils/validatesInputs';

const Title = styled.div`
  height: 18px;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #a1acbe;
}`;

const Withdraw = () => {
    const classes = useStyles();
    const [inputValue, setInputValut] = useState('0');

    // @ts-ignore
    return (
      <div className={classes.DepositWrapper}>
        <BorderScreen
          withConversion={false}
          header={'Available Balance'}
          link={{ to: config.routes.MY_ACCOUNT.DASHBOARD, text: translations.MY_ACCOUNT.DEPOSIT.NAVIGATION_TEXT }}
          body={[
                    (
                      <Grid item container>
                        <Grid item xs={12}>
                          <Title>Current Balance</Title>
                        </Grid>
                        <Grid item xs={12} className={classes.currentBalance}>
                          1,374.77 SSV
                        </Grid>
                        <Grid item xs={12} className={classes.currentBalanceDollar}>
                          ~$2,449.53
                        </Grid>
                      </Grid>
                    ),
                ]}
        />
        <BorderScreen
          withConversion
          header={'Withdraw'}
          body={[
                  (
                    <Grid item container>
                      <Grid item xs={12}>
                        <Title>Amount</Title>
                      </Grid>
                      <Grid container item xs={12} className={classes.BalanceWrapper}>
                        <Grid item container xs={12}>
                          <Grid item xs={6} className={classes.Balance}>
                            <IntegerInput
                              className={classes.BalanceInput}
                              type="text"
                              onChange={(e) => setInputValut(e.target.value)}
                              value={inputValue}
                            />
                          </Grid>
                          <Grid item container xs={6} className={classes.MaxButtonWrapper}>
                            <Grid item onClick={() => {
                                          console.log('need to implement');
                                      }}>
                              <img className={classes.MaxButtonImage} src={getImage('max-button.svg')} />
                            </Grid>
                            <Grid item className={classes.MaxButtonText}>SSV</Grid>
                          </Grid>
                          <Grid item xs={12} className={classes.BalanceInputDollar}>
                            ~$9485.67
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ),
                  (
                    <Grid item container>
                      <Grid item xs={12}>
                        <Title>Est. Remaining Days <Tooltip text={'need to implement'} /></Title>
                      </Grid>
                      <Grid item xs={12} className={classes.AmountOfDays}>1,795</Grid>
                    </Grid>
                  ),
              ]}
          bottom={(
            <Grid item xs={12} className={classes.CTAWrapper}>
              <CTAButton
                disable={false}
                onClick={() => { console.log('bla'); }}
                text={'Withdraw'}
              />
            </Grid>
          )}
          />
      </div>
    );
};

export default Withdraw;
