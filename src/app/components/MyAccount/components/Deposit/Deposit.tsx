import React from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import config, { translations } from '~app/common/config';
import Tooltip from '~app/common/components/Tooltip/Tooltip';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import { useStyles } from './Deposit.styles';
import { getImage } from '~lib/utils/filePath';

const Title = styled.div`
  height: 18px;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #a1acbe;
}
`;

const Deposit = () => {
    const classes = useStyles();

    return (
      <div className={classes.DepositWrapper}>
        <BorderScreen
          withConversion
          header={'Deposit'}
          link={{ to: config.routes.MY_ACCOUNT.DASHBOARD, text: translations.MY_ACCOUNT.DEPOSIT.NAVIGATION_TEXT }}
          body={[
                    (
                      <Grid item container>
                        <Grid item xs={12}>
                          <Title>Amount</Title>
                        </Grid>
                        <Grid container item xs={12} className={classes.BalanceWrapper}>
                          <Grid item container xs={12}>
                            <Grid item xs={6} className={classes.Balance}>
                              0.0
                            </Grid>
                            <Grid item container xs={6} className={classes.MaxButtonWrapper}>
                              <Grid item onClick={() => {
                                            console.log('need to implement');
                                        }}>
                                <img className={classes.MaxButtonImage} src={getImage('max-button.svg')} />
                              </Grid>
                              <Grid item className={classes.MaxButtonText}>SSV</Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} className={classes.WalletBalance}>
                            Wallet Balance: 10,000 SSV
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
            <Grid container item>
              <Grid container item>
                <Grid item></Grid>
                <Grid item></Grid>
              </Grid>
            </Grid>
          )}
        />
      </div>
    );
};

export default Deposit;
