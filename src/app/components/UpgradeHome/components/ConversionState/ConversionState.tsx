import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useStores } from '~app/hooks/useStores';
import { formatFloatToMaxPrecision } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import UpgradeStore, { UpgradeSteps } from '~app/common/stores/Upgrade.store';
import ConnectWalletButton from '~app/common/components/AppBar/components/ConnectWalletButton';
import { useStyles } from '~app/components/UpgradeHome/components/ConversionState/ConversionState.styles';

const MaxButton = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  color: #A1ACBE;
  cursor: pointer !important;
  margin-right: 10px;
`;

const BalanceLabelContainer = styled.div`
  display: flex;
  width: 100%;
`;

const BalanceLabel = styled.div`
  font-weight: 600;
  font-size: 12px;
  display: inline-block;
  text-align: right;
  color: #A1ACBE;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-right: 15px;
  cursor: pointer;
  margin-left: auto;
  margin-right: 0;
`;

const ConvertArrowContainer = styled.div`
  width: 100%;
  display: block;
  text-align: center;
  padding-bottom: 15px;
  margin-top: -8px;
  margin-left: 17.5px;
`;

const MiddlePartContainer = styled.div`
  display: block;
  width: 100%;
`;

const RateContainer = styled.div`
  font-weight: 500;
  font-size: 14px;
  display: flex;
  color: #5B6C84;
  padding-top: 15px;
`;

const RateLabel = styled.div`
  margin-left: 15px;
  margin-right: auto;
`;

const RateValue = styled.div`
  margin-right: 15px;
  margin-left: auto;
`;

export const ActionButton = styled(Button)`
  background-color: #5B6C84;
  color: white;
  cursor: pointer;
  margin-top: 15px;
  margin-bottom: 25px;
  font-size: 18px;
  text-transform: none;
  width: 100%;

  &:hover {
    color: #5B6C84;
  }

  &.Mui-disabled {
    color: rgba(0, 0, 0, 0.26);
    background-color: lightgray;
  }
`;

const ConversionState = () => {
  const classes = useStyles();
  const stores = useStores();
  const upgradeStore: UpgradeStore = stores.Upgrade;
  const walletStore: WalletStore = stores.Wallet;
  const [cdtValue, setCdtValue] = useState('0.0');
  const [ssvValue, setSsvValue] = useState('0.0');
  const [cdtError, setCdtError] = useState(false);
  const cdtImageStyle = {
    width: 59,
    height: 25,
  };

  // Check CDT Balance ASAP if connected
  useEffect(() => {
    if (walletStore.connected) {
      upgradeStore.loadAccountCdtBalance().then((balance: number) => {
        console.debug('User have CDT balance of:', balance, 'wei');
      });
    }
  }, [walletStore.connected]);

  // Update SSV value once CDT value is defined
  useEffect(() => {
    if (upgradeStore.cdtValue) {
      setSsvValue(formatFloatToMaxPrecision(upgradeStore.ssvValue));
    }
  }, [upgradeStore.cdtValue]);

  const onUpgradeButtonClick = () => {
    upgradeStore.setStep(UpgradeSteps.confirmTransaction);
  };

  /**
   * CDT input change callback.
   * @param event
   */
  const onCdtInputChange = (event: any) => {
    const numRegex = new RegExp(/^[0-9]\d*\.?\d*$/);
    setCdtValue(event.target.value);

    if (numRegex.test(event.target.value)) {
      const value = parseFloat(String(event.target.value));
      if (upgradeStore.cdtBalance !== null) {
        if (value <= upgradeStore.cdtBalance) {
          upgradeStore.setCdtValue(formatFloatToMaxPrecision(value));
          setCdtError(false);
        } else {
          setCdtError(true);
        }
        return;
      }
      upgradeStore.setCdtValue(formatFloatToMaxPrecision(value));
      setCdtError(false);
    } else {
      upgradeStore.setCdtValue(0);
      setCdtError(true);
    }
  };

  /**
   * Select as many CDT for conversion as user have on balance.
   */
  const setMaxCdt = () => {
    if (!upgradeStore.cdtBalance) {
      return;
    }
    setCdtError(false);
    setCdtValue(formatFloatToMaxPrecision(upgradeStore.cdtBalance));
    upgradeStore.setCdtValue(formatFloatToMaxPrecision(upgradeStore.cdtBalance));
  };

  const insufficientBalance = upgradeStore.cdtBalance !== null && !upgradeStore.cdtBalance;
  const upgradeButtonDisabled = cdtError || !upgradeStore.cdtValue || !upgradeStore.ssvValue || insufficientBalance;

  return (
    <Grid container spacing={0} justify="center" className={classes.root}>
      <Grid item xs={12} md={12} lg={12}>
        <FormControl variant="outlined" className={classes.formControl}>
          <OutlinedInput
            id="cdt-input"
            key="cdt-input"
            type="text"
            value={cdtValue}
            error={cdtError}
            onChange={onCdtInputChange}
            onFocus={() => {
              if (cdtValue === '0.0') {
                setCdtValue('');
              }
            }}
            endAdornment={(
              <InputAdornment position="end">
                <>
                  {upgradeStore.cdtBalance !== null ? (
                    <MaxButton onClick={() => setMaxCdt()}>
                      MAX
                    </MaxButton>
                  ) : ''}
                  <img src="/images/cdt-adornment.svg" style={cdtImageStyle} />
                </>
              </InputAdornment>
            )}
          />
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
          <MiddlePartContainer>
            {upgradeStore.cdtBalance ? (
              <BalanceLabelContainer>
                <BalanceLabel onClick={() => setMaxCdt()}>
                  Balance: {formatFloatToMaxPrecision(upgradeStore.cdtBalance)} CDT
                </BalanceLabel>
              </BalanceLabelContainer>
            ) : ''}
            <ConvertArrowContainer style={!upgradeStore.cdtBalance ? { marginTop: 10 } : {}}>
              <img src="/images/conversion-arrow.svg" />
            </ConvertArrowContainer>
          </MiddlePartContainer>
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
          <OutlinedInput
            disabled
            id="ssv-input"
            key="ssv-input"
            type="text"
            value={ssvValue}
            endAdornment={(
              <InputAdornment position="end">
                <img src="/images/ssv-adornment.svg" style={cdtImageStyle} />
              </InputAdornment>
            )}
          />

          <RateContainer>
            <RateLabel>Rate</RateLabel>
            <RateValue>1 SSV = 100 CDT</RateValue>
          </RateContainer>

          {walletStore.connected ? (
            <ActionButton
              onClick={onUpgradeButtonClick}
              disabled={upgradeButtonDisabled}
            >
              {insufficientBalance ? 'Insufficient CDT balance' : 'Upgrade'}
            </ActionButton>
          ) : (
            <ConnectWalletButton
              buttonComponent={ActionButton}
            />
          )}
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default observer(ConversionState);
