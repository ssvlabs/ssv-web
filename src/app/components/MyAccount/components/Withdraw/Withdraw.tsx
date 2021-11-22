import { observer } from 'mobx-react';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useStores } from '~app/hooks/useStores';
import { getImage } from '~lib/utils/filePath';
import Typography from '@material-ui/core/Typography';
import useUserFlow from '~app/hooks/useUserFlow';
import SsvStore from '~app/common/stores/SSV.store';
import { formatNumberToUi } from '~lib/utils/numbers';
import config, { translations } from '~app/common/config';
import IntegerInput from '~app/common/components/IntegerInput';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CTAButton from '~app/common/components/CTAButton/CTAButton';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import RemainingDays from '~app/components/MyAccount/common/componenets/RemainingDays/RemainingDays';
import { useStyles } from './Withdrew.styles';

const Title = styled.div`
  height: 18px;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #a1acbe;
`;

const Withdraw = () => {
    const classes = useStyles();
    const stores = useStores();
    const ssvStore: SsvStore = stores.SSV;
    const { redirectUrl, history } = useUserFlow();
    const [inputValue, setInputValue] = useState(0.0);
    const [userAgree, setUserAgreement] = useState(false);
    const [buttonColor, setButtonColor] = useState({ userAgree: '', default: '' });

    useEffect(() => {
        console.log(redirectUrl);
        redirectUrl && history.push(redirectUrl);
    }, [redirectUrl]);

    useEffect(() => {
        if (inputValue === ssvStore.networkContractBalance) {
            setButtonColor({ userAgree: '#d3030d', default: '#ec1c2640' });
        } else if (buttonColor.default === '#ec1c2640') {
            setButtonColor({ userAgree: '', default: '' });
        }
    }, [inputValue]);

    const withdrawSsv = async () => {
        await ssvStore.withdrawSsv(inputValue.toString(), ssvStore.setTransactionInProgress);
        setInputValue(0.0);
    };

    const inputHandler = (value: number) => {
        if (value > ssvStore.networkContractBalance) {
            setInputValue(ssvStore.networkContractBalance);
        } else {
            setInputValue(value);
        }
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
                          {formatNumberToUi(ssvStore.networkContractBalance)} SSV
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
                                  inputHandler(e.target.value); }}
                              value={inputValue}
                              className={classes.Balance}
                            />
                          </Grid>
                          <Grid item container xs={6} className={classes.MaxButtonWrapper}>
                            <Grid item onClick={() => { setInputValue(ssvStore.networkContractBalance); }}>
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
                    <>
                      <RemainingDays fromPage={'withdraw'} inputValue={inputValue} />
                    </>
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
                disable={!userAgree}
                onClick={withdrawSsv}
                withAllowance
                backgroundColor={userAgree ? buttonColor.userAgree : buttonColor.default}
              />
            </Grid>
          )}
          />
      </div>
    );
};

export default observer(Withdraw);
