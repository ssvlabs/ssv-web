import React, { useEffect, useState } from 'react';
import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import ContractOperator, { IOperator } from '~app/common/stores/contract/ContractOperator.store';
import { useStyles } from './OperatorSelector.styles';
import { OperatorName, OperatorKey } from './components/Operator';

type OperatorSelectorProps = {
  dataTestid: string,
  index: number
  setOpenMenu: any,
  shouldOpenMenu: boolean,
  indexedOperator: IOperator,
};

const OperatorSelector = ({ indexedOperator, shouldOpenMenu, setOpenMenu, index, dataTestid }: OperatorSelectorProps) => {
  const classes = useStyles();
  const stores = useStores();
  const contractOperator: ContractOperator = stores.ContractOperator;
  const walletStore: WalletStore = stores.Wallet;
  const [selectedOperator, selectOperator] = useState('');
  const selectOperatorMethod = (operator: any) => {
    if (selectedOperator) {
      contractOperator.unselectOperator(selectedOperator);
    }
    contractOperator.selectOperator(operator.pubkey);
    selectOperator(operator);
  };

  useEffect(() => {
    if (indexedOperator.selected && indexedOperator.autoSelected && indexedOperator.pubkey !== selectedOperator) {
      selectOperatorMethod(indexedOperator);
    }
  });

  const onSelectOperator = (operator: any) => {
    selectOperatorMethod(operator);
    setOpenMenu(null);
  };

  const operatorKeySeralize = (publicKey: string) => {
    return `${publicKey.substr(0, 4)}...${publicKey.substr(publicKey.length - 4, 4)}`;
  };

  const renderOperator = (operator: any, menu: boolean = true) => {
    const key = Math.floor(Math.random() * 100001) + Math.floor(Math.random() * 100001) + Math.floor(Math.random() * 91239123);
    return (
      <Grid
        key={key}
        container
        alignItems={'center'}
        direction="row"
        justify="space-between"
        className={`${menu && classes.menuItem} ${menu && operator.selected && classes.disable}`}
        onClick={() => { !operator.selected && onSelectOperator(operator); }}
      >
        <Grid item xs={5}>
          <OperatorName>{operator.name}</OperatorName>
          <OperatorKey>{operatorKeySeralize(sha256(walletStore.decodeOperatorKey(operator.pubkey)))}</OperatorKey>
        </Grid>
        <Grid item xs={5}>
          <Grid container className={classes.verifiedWrapper} justify={'flex-end'} spacing={2}>
            <Grid item xs={6} md={6}>
              {operator.verified ? (
                <Grid container className={classes.verifiedText}>
                  <Grid item xs={8}>
                    verified
                  </Grid>
                  <Grid item xs={4}>
                    <img src={'/images/checkmark_icon.svg'} className={classes.verifiedIcon} />
                  </Grid>
                </Grid>
            ) : ''}
            </Grid>
            <Grid item>
              <img src={'/images/chart_icon.svg'} className={classes.chartIcon} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
);
  };

  return (
    <div key={index}>
      <button 
        data-testid={dataTestid}
        className={`${classes.selectButton} ${shouldOpenMenu && classes.selected}`}
        onClick={() => setOpenMenu(shouldOpenMenu ? null : index)}
      >
        { selectedOperator ? (
                renderOperator(selectedOperator, false)
        )
            : <> Select Operator <img src={'/images/arrow_up_icon.svg'} className={`${classes.buttonArrow} ${shouldOpenMenu && classes.arrowSelected}`} /></>
        }
      </button>
      {shouldOpenMenu && (
      <div className={classes.menuWrapper}>
        {contractOperator.operators.map((operator: IOperator) => {
          return (
              renderOperator(operator)
          );
        })}
      </div>
    )}
    </div>
  );
};

export default observer(OperatorSelector);
