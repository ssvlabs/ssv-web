import { observer } from 'mobx-react';
import React, { useEffect, useState, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import SsvStore from '~app/common/stores/SSV.store';
import config, { translations } from '~app/common/config';
import OperatorSelector from './components/SelectOperator';
import SsvAndSubTitle from '~app/common/components/SsvAndSubTitle';
import ApplicationStore from '~app/common/stores/Application.store';
import OperatorStore, { IOperator } from '~app/common/stores/Operator.store';
import PrimaryButton from '~app/common/components/PrimaryButton/PrimaryButton';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import { useStyles } from '~app/components/RegisterValidatorHome/components/SelectOperators/SelectOperators.styles';

const SelectOperators = () => {
  const stores = useStores();
  const ssvStore: SsvStore = stores.SSV;
  const applicationStore: ApplicationStore = stores.Application;
  const operatorStore: OperatorStore = stores.Operator;
  const classes = useStyles();
  const wrapperRef = useRef(null);
  const { redirectUrl, history } = useUserFlow();
  const [openMenu, openMenuWithIndex] = useState(null);
  const [allOperatorsVerified, setAllOperatorVerified] = useState(true);

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
  }, [JSON.stringify(operatorStore.selectedOperators)]);

  const onSelectOperatorsClick = async () => {
    history.push(config.routes.VALIDATOR.ACCOUNT_BALANCE_AND_FEE);
  };

  const unselectAllOperators = () => {
    operatorStore.unselectAllOperators();
  };

    return (
      <BorderScreen
        link={{ to: config.routes.VALIDATOR.IMPORT, text: 'Back' }}
        header={translations.VALIDATOR.SELECT_OPERATORS.TITLE}
        body={[
          <Grid container item>
            <Grid item xs={12} className={classes.SubHeader}>{translations.VALIDATOR.SELECT_OPERATORS.TITLE}</Grid>
            <Grid item xs={12} zeroMinWidth className={classes.SelectOperatorsWrapper}>
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
            {!allOperatorsVerified && (
            <Grid container item xs={12} className={classes.WarningMessage}>
              <Grid item xs={12} className={classes.WarningHeader}>
                You have selected one or more operator that are <span className={classes.NotVerifiedText}>not verified.</span>
              </Grid>
              <Grid item xs={12}>
                Unverified operators that were not reviewed and their identity is not confirmed, may pose a threat to your validators’ performance.
              </Grid>
              <Grid item xs={12}>
                Please proceed only if you know and trust these operators.
              </Grid>
            </Grid>
            )}
            <Grid container item xs={12} className={classes.TotalFeesWrapper} justify={'space-between'}>
              <Grid item className={classes.TotalFeesHeader}>
                Total Operators Yearly Fee
              </Grid>
              <Grid item>
                <SsvAndSubTitle bold ssv={ssvStore.getFeeForYear(operatorStore.getSelectedOperatorsFee)} subText={'~$757.5'} subTextCenter={false} />
              </Grid>
            </Grid>
            <PrimaryButton dataTestId={'operators-selected-button'} disable={!operatorStore.selectedEnoughOperators} text={'Next'} onClick={onSelectOperatorsClick} />
          </Grid>,
        ]}
      />
    );
};

export default observer(SelectOperators);
