import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import useUserFlow from '~app/hooks/useUserFlow';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import config, { translations } from '~app/common/config';
import IntegerInput from '~app/common/components/IntegerInput';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import RemainingDays from '~app/components/MyAccount/common/componenets/RemainingDays/RemainingDays';
import PrimaryWithAllowance from '~app/common/components/Buttons/PrimaryWithAllowance/PrimaryWithAllowance';
import { useStyles } from './Withdrew.styles';

const Withdraw = () => {
    const classes = useStyles();
    const stores = useStores();
    const ssvStore: SsvStore = stores.SSV;
    const { redirectUrl, history } = useUserFlow();
    const [inputValue, setInputValue] = useState(0.0);
    const [userAgree, setUserAgreement] = useState(false);
    const [buttonColor, setButtonColor] = useState({ userAgree: '', default: '' });

    useEffect(() => {
        redirectUrl && history.push(redirectUrl);
    }, [redirectUrl]);

    useEffect(() => {
        if (inputValue === ssvStore.networkContractBalance && ssvStore.isValidatorState) {
            setButtonColor({ userAgree: '#d3030d', default: '#ec1c2640' });
        } else if (buttonColor.default === '#ec1c2640') {
            setButtonColor({ userAgree: '', default: '' });
        }
    }, [inputValue]);

    const withdrawSsv = async () => {
        ssvStore.withdrawSsv(inputValue.toString()).then((success: boolean) => {
            if (success) setInputValue(0.0);
        });
    };

    const inputHandler = (e: any) => {
        const value = e.target.value;
        if (value > ssvStore.networkContractBalance) {
            setInputValue(ssvStore.networkContractBalance);
        } else if (value < 0) {
            setInputValue(0);
        } else {
            setInputValue(value);
        }
    };

    const secondBorderScreen = [(
      <Grid item container>
        <Grid container item xs={12} className={classes.BalanceWrapper}>
          <Grid item container xs={12}>
            <Grid item xs={6}>
              <IntegerInput
                type="number"
                value={inputValue}
                onChange={inputHandler}
                className={classes.Balance}
              />
            </Grid>
            <Grid item container xs={6} className={classes.MaxButtonWrapper}>
              <Grid item onClick={() => { setInputValue(ssvStore.networkContractBalance); }} className={classes.MaxButton}>
                MAX
              </Grid>
              <Grid item className={classes.MaxButtonText}>SSV</Grid>
            </Grid>
            <Grid item xs={12} className={classes.BalanceInputDollar}>
              ~$9485.67
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )];

    if (ssvStore.isValidatorState) {
     secondBorderScreen.push((<RemainingDays fromPage={'withdraw'} inputValue={inputValue} />));
    }

    return (
      <>
        <BorderScreen
          header={'Available Balance'}
          wrapperClass={classes.FirstSquare}
          navigationLink={config.routes.MY_ACCOUNT.DASHBOARD}
          navigationText={translations.MY_ACCOUNT.DEPOSIT.NAVIGATION_TEXT}
          body={[
                    (
                      <Grid item container>
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
          withoutNavigation
          header={'Withdraw'}
          body={secondBorderScreen}
          bottom={(
            <Grid item xs={12}>
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
              <PrimaryWithAllowance
                text={'Withdraw'}
                disable={!userAgree || inputValue === 0}
                onClick={withdrawSsv}
                withAllowance
              />
            </Grid>
          )}
          />
      </>
    );
};

export default observer(Withdraw);
