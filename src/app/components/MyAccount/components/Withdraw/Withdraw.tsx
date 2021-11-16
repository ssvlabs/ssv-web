import { observer } from 'mobx-react';
import styled from 'styled-components';
import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { useStores } from '~app/hooks/useStores';
import config, { translations } from '~app/common/config';
import { getImage } from '~lib/utils/filePath';
import Typography from '@material-ui/core/Typography';
import Tooltip from '~app/common/components/Tooltip/Tooltip';
import IntegerInput from '~app/common/components/IntegerInput';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CTAButton from '~app/common/components/CTAButton/CTAButton';
import ContractSsv from '~app/common/stores/contract/ContractSsv.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import { useStyles } from './Withdrew.styles';
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
    const stores = useStores();
    const [inputValue, setInputValue] = useState(0.0);
    const [userAgree, setUserAgreement] = useState(false);
    const contractSsvStore: ContractSsv = stores.ContractSsv;

    const withdrawSsv = async () => {
        await contractSsvStore.withdrawSsv(inputValue.toString());
        setInputValue(0.0);
    };

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
                          {contractSsvStore.networkContractBalance} SSV
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
                          <Grid item xs={6}>
                            <IntegerInput
                              type="number"
                              onChange={(e) => { // @ts-ignore
                                        setInputValue(e.target.value); }}
                              value={inputValue}
                              className={classes.Balance}
                                />
                          </Grid>
                          <Grid item container xs={6} className={classes.MaxButtonWrapper}>
                            <Grid item onClick={() => { setInputValue(contractSsvStore.networkContractBalance); }}>
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
              <FormControlLabel
                onClick={() => { setUserAgreement(!userAgree); }}
                style={{ marginBottom: '10px' }}
                control={(
                  <Grid className={classes.CheckboxWrapper}>
                    <Grid className={userAgree ? classes.Checkbox : ''} />
                  </Grid>
                )}
                label={(
                  <Typography className={classes.Agreement}>
                    I understand that withdrawing this amount will liquidate my account
                  </Typography>
                )}
                />
              <CTAButton
                text={'Withdraw'}
                disable={contractSsvStore.networkContractBalance === 0 || inputValue <= 0}
                onClick={withdrawSsv}
                withAllowance
                // backgroundColor={userAgree ? '#d3030d' : '#ec1c2640'}
              />
            </Grid>
          )}
          />
      </div>
    );
};

export default observer(Withdraw);
