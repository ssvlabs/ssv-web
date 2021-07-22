import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { FormControl, OutlinedInput } from '@material-ui/core';
import { useStores } from '~app/hooks/useStores';
import UpgradeStore from '~app/common/stores/Upgrade.store';
import { useStyles } from '~app/components/UpgradeHome/components/ConversionState/ConversionState.styles';
import Button from '@material-ui/core/Button';

const MaxButton = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  color: #A1ACBE;
  cursor: pointer!important;
  margin-right: 10px;
`;

const BalanceLabel = styled.div`
  font-weight: 600;
  font-size: 12px;
  display: block;
  text-align: right;
  color: #A1ACBE;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-right: 15px;
`;

const ConvertArrowContainer = styled.div`
  width: 100%;
  display: block;
  text-align: center;
  padding-bottom: 10px;
  margin-top: -13px;
`;

const MiddlePartContainer = styled.div`
  display: block;
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

const SingleUpgradeButton = styled(Button)`
  background-color: #5B6C84;
  color: white;
  cursor: pointer;
  margin-top: 15px;
  margin-bottom: 25px;
  font-size: 18px;
  text-transform: none;
  &:hover {
    color: #5B6C84;
  }
`;

const ConversionState = () => {
  const classes = useStyles();
  const stores = useStores();
  const [cdtValue, setCdtValue] = useState(0);
  const [ssvValue, setSsvValue] = useState(0);
  const upgradeStore: UpgradeStore = stores.Upgrade;
  const cdtImageStyle = {
    width: 59,
    height: 25,
  };

  useEffect(() => {
    setSsvValue(upgradeStore.ssvValue);
  }, [upgradeStore.cdtValue]);

  useEffect(() => {
    const numRegex = new RegExp(/^\d+(\.\d+)?$/);
    if (numRegex.test(String(cdtValue))) {
      upgradeStore.setCdtValue(cdtValue);
    }
    if (!cdtValue) {
      upgradeStore.setCdtValue(0);
    }
  }, [cdtValue]);

  return (
    <Grid container spacing={0} justify="center" className={classes.root}>
      <Grid item xs={12} md={12} lg={12}>
        <FormControl variant="outlined" className={classes.formControl}>
          <OutlinedInput
            id="cdt-input"
            type="text"
            value={cdtValue}
            onChange={(event: any) => {
              const numRegex = new RegExp(/^(?!0{2,})\d{0,}((\.?)\d{0,}?)$/);
              if (numRegex.test(event.target.value)) setCdtValue(event.target.value);
            }}
            endAdornment={(
              <InputAdornment position="end">
                <>
                  {upgradeStore.cdtBalance ? (
                    <MaxButton onClick={() => {
                      setCdtValue(upgradeStore.cdtBalance);
                      upgradeStore.setCdtValue(upgradeStore.cdtBalance);
                    }}>
                      MAX
                    </MaxButton>
                  ) : ''}
                  <img src="/images/cdt-adornment.svg" style={cdtImageStyle} />
                </>
              </InputAdornment>
            )}
          />
          <MiddlePartContainer>
            {upgradeStore.cdtBalance ? (
              <BalanceLabel>
                Balance: {upgradeStore.cdtBalance} CDT
              </BalanceLabel>
            ) : ''}
            <ConvertArrowContainer style={!upgradeStore.cdtBalance ? { marginTop: 10 } : {}}>
              <img src="/images/conversion-arrow.svg" />
            </ConvertArrowContainer>
          </MiddlePartContainer>
          <OutlinedInput
            disabled
            id="ssv-input"
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
            <RateValue>1 CDT = 0.01 SSV</RateValue>
          </RateContainer>
          <SingleUpgradeButton>
            Upgrade
          </SingleUpgradeButton>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default observer(ConversionState);
