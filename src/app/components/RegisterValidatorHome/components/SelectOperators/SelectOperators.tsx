import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { isMobile } from 'react-device-detect';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import WarningIcon from '@material-ui/icons/Warning';
import CTAButton from '~app/common/components/CTAButton';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
import ApplicationStore from '~app/common/stores/Application.store';
import { useStyles } from '~app/components/GenerateOperatorKeys/GenerateOperatorKeys.styles';
import ContractOperator, { IOperator } from '~app/common/stores/contract/ContractOperator.store';
import OperatorSelector from './components/OperatorSelector';

const actionButtonMargin = isMobile ? '130px' : '140px';
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
  font-size: 13px;
  @media (max-width: 768px) {
    font-size: 10px;
  }
  
`;

const WarningTextSubHeader = styled.p`
  margin: 5px 0px 0px 0px
`;

const WarningTextHeader = styled.p`
  margin: 0px 0px 5px 0px;
  font-weight: 600;
`;

const SelectOperators = () => {
  const stores = useStores();
  const contractOperator: ContractOperator = stores.ContractOperator;
  const applicationStore: ApplicationStore = stores.Application;
  const classes = useStyles();
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const { redirectUrl, history } = useUserFlow();
  const [openMenu, setOpenMenu] = useState(null);
  const [allOperatorsVerified, setAllOperatorVerified] = useState(true);

  useEffect(() => {
    unselectAllOperators();
    redirectUrl && history.push(redirectUrl);
  }, [redirectUrl]);

  useEffect(() => {
    setButtonEnabled(contractOperator.selectedEnoughOperators);

    // If no required information for this step - return to first screen
    if (!contractOperator.operators.length && !contractOperator.operatorsLoaded && !contractOperator.loadingOperator) {
      applicationStore.setIsLoading(true);
      contractOperator.loadOperators().then(() => {
        applicationStore.setIsLoading(false);
      });
    }
  }, [contractOperator.operators, contractOperator.selectedEnoughOperators, contractOperator.loadingOperator]);
  
  useEffect(() => {
    let allOperatorsAreVerified = true;
    if (contractOperator.operators) {
      contractOperator.operators.forEach((operator) => {
        if (operator.selected && !operator.verified) allOperatorsAreVerified = false;
      });
    }
    if (allOperatorsVerified !== allOperatorsAreVerified) {
      setAllOperatorVerified(allOperatorsAreVerified);
    }
  }, [contractOperator.operators]);

  const onSelectOperatorsClick = async () => {
    history.push(config.routes.VALIDATOR.SLASHING_WARNING);
  };

  const unselectAllOperators = () => {
    contractOperator.unselectAllOperators();
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
        <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
          <Grid item xs zeroMinWidth className={classes.gridContainer}>
            {config.FEATURE.OPERATORS.AUTO_SELECT ? (
              <Button
                disabled={!contractOperator.operators.length}
                variant="contained"
                color="primary"
                style={{ width: '100%' }}
                onClick={contractOperator.autoSelectOperators}
                      >
                <AutorenewIcon />
                        &nbsp;Auto-select
              </Button>
            ) : ''}

            {contractOperator.operators.slice(0, config.FEATURE.OPERATORS.SELECT_MINIMUM_OPERATORS).map((operator: IOperator, index: number) => (
              <OperatorSelector
                key={index}
                shouldOpenMenu={openMenu === index}
                index={index}
                setOpenMenu={setOpenMenu}
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
                <WarningTextSubHeader>Operators that were not reviewed and their identify is not
                  confirmed,</WarningTextSubHeader>
                <WarningTextSubHeader> may pose a threat to your validator performance</WarningTextSubHeader>
                <WarningTextSubHeader>Please proceed only if you know and trust this
                  operator.</WarningTextSubHeader>
              </WarningTextWrapper>
            </WarningMessage>
            )}
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
