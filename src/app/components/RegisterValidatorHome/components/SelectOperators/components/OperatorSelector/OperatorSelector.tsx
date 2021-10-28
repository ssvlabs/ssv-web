import React, { useEffect, useState } from 'react';
import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import config from '~app/common/config';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import ContractOperator, { IOperator } from '~app/common/stores/contract/ContractOperator.store';
import { useStyles } from './OperatorSelector.styles';
import { OperatorName, OperatorKey } from './components/Operator';
// import { debounce } from '@material-ui/core';
// import LinearProgress from '@material-ui/core/LinearProgress';

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
  // const [batchIndex, setBatchIndex] = useState(20);
  // const [loadingBatch, setLoadingBatch] = useState(false);
  // const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    if (indexedOperator.selected && indexedOperator.autoSelected && indexedOperator.pubkey !== selectedOperator) {
      selectOperatorMethod(indexedOperator);
    }
  });

  // const lazyLoad = debounce(async (e) => {
  //   const element = e.target;
  //
  //   if (element.scrollTop + element.offsetHeight > element.scrollHeight - 200) {
  //     if (contractOperator.operators.length > batchIndex && !loadingBatch) {
  //       setLoadingBatch(true);
  //       await progressBar(10);
  //       setBatchIndex(batchIndex + 20);
  //       setLoadingBatch(false);
  //     }
  //   }
  // }, 100);

  const selectOperatorMethod = (operator: any) => {
    if (selectedOperator) {
      contractOperator.unselectOperator(selectedOperator);
    }
    contractOperator.selectOperator(operator.pubkey, index + 1);
    selectOperator(operator);
  };

  const onSelectOperator = (operator: any) => {
    selectOperatorMethod(operator);
    setOpenMenu(null);
  };

  const operatorAddressSeralize = (address: string) => {
    return `${address.substr(0, 6)}...${address.substr(address.length - 4, 4)}`;
  };
  
  const redirectTo = (pubKey: string) => {
    window.open(`${config.links.LINK_EXPLORER}/operators/${sha256(walletStore.decodeOperatorKey(pubKey))}`);
  };

  const closeMenu = () => {
    setOpenMenu(shouldOpenMenu ? null : index);
    // setBatchIndex(10);
  };

  // const progressBar = async (percentage: number) => {
  //  return new Promise((resolve) => {
  //     setTimeout(() => {
  //      setProgressPercentage(percentage);
  //      if (percentage !== 100) {
  //        resolve(progressBar(percentage + 10));
  //      } else {
  //        resolve(true);
  //        setProgressPercentage(10);
  //      }
  //    });
  //   });
  // };

  const renderOperator = ({ operator, menu, key }: { operator: any, menu?: boolean, key?: number }) => {
    return (
      <Grid
        key={key}
        container
        alignItems={'center'}
        direction="row"
        justify="space-between"
        className={`${menu && classes.menuItem} ${menu && operator.selected && classes.disable}`}
        >
        <Grid item xs={7} onClick={() => {
            !operator.selected && onSelectOperator(operator);
          }}>
          <OperatorName>{operator.name}</OperatorName>
          <OperatorKey>{operatorAddressSeralize(sha256(walletStore.decodeOperatorKey(operator.pubkey)))}</OperatorKey>
        </Grid>
        <Grid item xs={5}>
          <Grid container className={classes.verifiedWrapper} justify={'flex-end'} spacing={2}>
            <Grid item xs={6} md={6} onClick={() => {
                !operator.selected && onSelectOperator(operator);
              }}>
              {operator.verified || operator.dappNode ? (
                <Grid container className={operator.verified ? classes.verifiedText : classes.dappNode}>
                  <Grid item xs={8}>
                    {operator.verified ? 'Verified' : 'DAppNode'}
                  </Grid>
                  <Grid item xs={4}>
                    {operator.verified && <img src={getImage('checkmark_icon.svg')} className={classes.verifiedIcon} />}
                    {operator.dappNode && <img src={getImage('checkmark_icon_dappnode.svg')} className={classes.dappNodeIcon} />}
                  </Grid>
                </Grid>
                ) : ''}
            </Grid>
            <Grid item onClick={() => {
                redirectTo(operator.pubkey);
              }}>
              <img src={getImage('chart_icon.svg')} className={classes.chartIcon} />
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
        onClick={closeMenu}
      >
        { selectedOperator ? (
                renderOperator({ operator: selectedOperator, menu: false })
        )
            : <> Select Operator <img src={getImage('arrow_up_icon.svg')} className={`${classes.buttonArrow} ${shouldOpenMenu && classes.arrowSelected}`} /></>
        }
      </button>
      {shouldOpenMenu && (
      <div className={classes.menuWrapper}>
        {contractOperator.operators.map((operator: IOperator, operatorIndex) => {
          return (
              renderOperator({ operator, menu: true, key: operatorIndex })
          );
        })}
        {/* {loadingBatch && <div className={classes.menuLoader}><LinearProgress variant="determinate" value={progressPercentage} /></div>} */}
      </div>
    )}
    </div>
  );
};

export default observer(OperatorSelector);
