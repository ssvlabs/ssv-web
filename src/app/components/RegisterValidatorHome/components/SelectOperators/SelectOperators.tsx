import { observer } from 'mobx-react';
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { isMobile } from 'react-device-detect';
import WarningIcon from '@material-ui/icons/Warning';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import SsvStore from '~app/common/stores/SSV.store';
import CTAButton from '~app/common/components/CTAButton';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
import SsvAndSubTitle from '~app/common/components/SsvAndSubTitle';
import ApplicationStore from '~app/common/stores/Application.store';
import OperatorStore, { IOperator } from '~app/common/stores/Operator.store';
import { useStyles } from '~app/components/GenerateOperatorKeys/GenerateOperatorKeys.styles';
import OperatorSelector from './components/OperatorSelector';

const WarningMessage = styled.div`
  margin-bottom: 20px;
  color: black;
  display: flex;
  background-color: rgb(255, 244, 229);
  justify-content: space-evenly;
  padding: 20px 12px 20px 12px;
`;

const WarningIconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const WarningTextWrapper = styled.div`
  padding-left: 10px;
  font-size: 13px;
  @media (max-width: 768px) {
    font-size: 10px;
  }
  
`;

const WarningTextSubHeader = styled.div`
  margin: 5px 0px 0px 0px;
`;

const WarningTextHeader = styled.p`
  margin: 0px 0px 5px 0px;
  font-weight: 600;
`;

const SelectOperators = () => {
  const stores = useStores();
  const ssvStore: SsvStore = stores.SSV;
  const applicationStore: ApplicationStore = stores.Application;
  const operatorStore: OperatorStore = stores.Operator;
  const classes = useStyles();
  const wrapperRef = useRef(null);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const { redirectUrl, history } = useUserFlow();
  const [openMenu, openMenuWithIndex] = useState(null);
  const [allOperatorsVerified, setAllOperatorVerified] = useState(true);
  const [actionButtonMargin, setActionButtonMargin] = useState(isMobile ? '130px' : '140px');

  useEffect(() => {
    unselectAllOperators();
    redirectUrl && history.push(redirectUrl);
  }, [redirectUrl]);

  useEffect(() => {
    function handleClickOutside(event: any) {
      // @ts-ignore
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        openMenuWithIndex(null);
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (redirectUrl) return;
    setButtonEnabled(operatorStore.selectedEnoughOperators);

    // If no required information for this step - return to first screen
    if (!operatorStore.operators.length && !operatorStore.operatorsLoaded && !operatorStore.loadingOperator) {
      applicationStore.setIsLoading(true);
      operatorStore.loadOperators().then(() => {
        applicationStore.setIsLoading(false);
      });
    }
  }, [redirectUrl, operatorStore.operators, operatorStore.selectedEnoughOperators, operatorStore.loadingOperator]);

  useEffect(() => {
    let allOperatorsAreVerified = true;
    Object.values(operatorStore.selectedOperators).forEach((operator: IOperator) => {
      if (!operator.verified && !operator.dappNode) allOperatorsAreVerified = false;
    });
    if (allOperatorsVerified !== allOperatorsAreVerified) {
      setAllOperatorVerified(allOperatorsAreVerified);
    }
    if (!allOperatorsAreVerified) {
      setActionButtonMargin('100px');
    }
  }, [JSON.stringify(operatorStore.selectedOperators)]);

  const onSelectOperatorsClick = async () => {
    history.push(config.routes.VALIDATOR.ACCOUNT_BALANCE_AND_FEE);
  };

  const unselectAllOperators = () => {
    operatorStore.unselectAllOperators();
  };

  return (
    <Screen
      navigationText={translations.VALIDATOR.IMPORT.TITLE}
      navigationLink={config.routes.VALIDATOR.DECRYPT}
      navigationOnClick={unselectAllOperators}
      title={translations.VALIDATOR.SELECT_OPERATORS.TITLE}
      subTitle={translations.VALIDATOR.SELECT_OPERATORS.DESCRIPTION}
      styleOptions={{ actionButtonMarginTop: actionButtonMargin }}
      body={(
        <Grid ref={wrapperRef} container wrap="nowrap" spacing={0} className={classes.gridContainer}>
          <Grid item xs zeroMinWidth className={classes.gridContainer}>
            {config.FEATURE.OPERATORS.AUTO_SELECT ? (
              <Button
                disabled={!operatorStore.operators.length}
                variant="contained"
                color="primary"
                style={{ width: '100%' }}
                onClick={operatorStore.autoSelectOperators}
                      >
                <AutorenewIcon />
                        &nbsp;Auto-select
              </Button>
            ) : ''}

            {operatorStore.operators.slice(0, config.FEATURE.OPERATORS.SELECT_MINIMUM_OPERATORS).map((operator: IOperator, index: number) => (
              <OperatorSelector
                key={index}
                shouldOpenMenu={openMenu === index}
                index={index}
                openMenuWithIndex={openMenuWithIndex}
                dataTestid={`operator-selector-${index}`}
                indexedOperator={operator}
              />
            ))}
          </Grid>
        </Grid>
      )}
      actionButton={(
        <>
          {!allOperatorsVerified && (
            <WarningMessage>
              <WarningIconWrapper>
                <WarningIcon fontSize={isMobile ? 'default' : 'large'} style={{ color: 'orange' }} />
              </WarningIconWrapper>
              <WarningTextWrapper>
                <WarningTextHeader>You have selected an operator that is not verified.</WarningTextHeader>
                <WarningTextSubHeader>Operators that were not reviewed and their identify is not confirmed may pose a threat to your validator performance.</WarningTextSubHeader>
                <WarningTextSubHeader>Please proceed only if you know and trust this operator.</WarningTextSubHeader>
              </WarningTextWrapper>
            </WarningMessage>
            )}
          <Grid container className={classes.TotalFees} justify={'space-between'}>
            <Grid item className={classes.TotalFeesHeader}>
              Total Operators Yearly Fee
            </Grid>
            <Grid item>
              <SsvAndSubTitle ssv={ssvStore.getFeeForYear(operatorStore.getSelectedOperatorsFee)} subText={'/year'} subTextCenter={false} />
            </Grid>
          </Grid>
          <CTAButton
            testId={'operators-selected-button'}
            disable={!buttonEnabled}
            onClick={onSelectOperatorsClick}
            text={'Next'}
            />
        </>
      )}
    />
  );
};

export default observer(SelectOperators);
