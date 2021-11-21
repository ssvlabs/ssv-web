import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { debounce } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import config from '~app/common/config';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/SSV.store';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import OperatorStore, { IOperator } from '~app/common/stores/Operator.store';
// import LinearProgress from '@material-ui/core/LinearProgress';
import { useStyles } from './OperatorSelector.styles';
import { OperatorName, OperatorKey } from './components/Operator';

type OperatorSelectorProps = {
  dataTestid: string,
  index: number
  openMenuWithIndex: any,
  shouldOpenMenu: boolean,
  indexedOperator: IOperator,
};

const OperatorSelector = ({ indexedOperator, shouldOpenMenu, openMenuWithIndex, index, dataTestid }: OperatorSelectorProps) => {
  const classes = useStyles();
  const stores = useStores();
  const contractSsv: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const operatorStore: OperatorStore = stores.Operator;
  const [selectedOperator, selectOperator] = useState('');
  const [batchIndex, setBatchIndex] = useState(20);
  // const [loadingBatch, setLoadingBatch] = useState(false);
  // const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    if (operatorStore.isOperatorSelected(indexedOperator.pubkey) && indexedOperator.autoSelected && indexedOperator.pubkey !== selectedOperator) {
      selectOperatorMethod(indexedOperator);
    }
  });

  const lazyLoad = debounce(async (e) => {
    const element = e.target;

    if (element.scrollTop + element.offsetHeight > element.scrollHeight - 200) {
      if (operatorStore.operators.length > batchIndex) {
        // setLoadingBatch(true);
        // await progressBar(10);
        // setTimeout(() => {
        //   setLoadingBatch(false);
        //
        // }, 2000);
        setBatchIndex(batchIndex + 20);
      }
    }
  }, 100);

  const selectOperatorMethod = (operator: any) => {
    if (selectedOperator) {
      operatorStore.unselectOperator(index);
    }
    operatorStore.selectOperator(operator, index);
    selectOperator(operator);
  };

  const onSelectOperator = (operator: any) => {
    selectOperatorMethod(operator);
    openMenuWithIndex(null);
  };

  const operatorAddressSeralize = (address: string) => {
    return `${address.substr(0, 6)}...${address.substr(address.length - 4, 4)}`;
  };
  
  const redirectTo = (pubKey: string) => {
    window.open(`${config.links.LINK_EXPLORER}/operators/${sha256(walletStore.decodeKey(pubKey))}`);
  };

  const closeMenu = () => {
    openMenuWithIndex(shouldOpenMenu ? null : index);
    setBatchIndex(10);
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
    const operatorSelected = operatorStore.isOperatorSelected(operator.pubkey);
    return (
      <Grid key={key} container className={`${menu && classes.menuItem} ${menu && operatorSelected && classes.disable}`} onClick={() => { !operatorSelected && onSelectOperator(operator); }}>
        <Grid item container xs={7} onClick={() => { !operatorSelected && onSelectOperator(operator); }}>
          <Grid item xs>
            <Grid container>
              <Grid item>
                <OperatorName>{`${operator.name}`}</OperatorName>
              </Grid>
              <Grid item xs onClick={() => { !operatorSelected && onSelectOperator(operator); }}>
                {operator.verified || operator.dappNode ? (
                  <Grid container className={operator.verified ? classes.verifiedText : classes.dappNode}>
                    <Grid item xs={8}>
                      {operator.verified ? 'Verified' : 'DAppNode'}
                    </Grid>
                    <Grid item xs>
                      {operator.verified && <img src={getImage('checkmark_icon.svg')} className={classes.verifiedIcon} />}
                      {operator.dappNode && <img src={getImage('checkmark_icon_dappnode.svg')} className={classes.dappNodeIcon} />}
                    </Grid>
                  </Grid>
                ) : ''}
              </Grid>
            </Grid>
            <Grid>
              <OperatorKey>{operatorAddressSeralize(sha256(walletStore.decodeKey(operator.pubkey)))}</OperatorKey>
            </Grid>
          </Grid>
        </Grid>
        <Grid container xs>
          <Grid item xs={12} className={classes.Fee}>
            {contractSsv.getFeeForYear(operator.fee)} SSV
          </Grid>
          <Grid className={classes.FeeDollar}>
            ~$0
          </Grid>
        </Grid>
        <Grid item xs>
          <Grid container className={classes.verifiedWrapper} justify={'flex-end'}>
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
      <div className={classes.menuWrapper} onScroll={lazyLoad}>
        <Grid container className={classes.DropDownMenuHeader}>
          <Grid item xs={6}>OPERATOR NAME</Grid>
          <Grid item xs className={classes.YearlyFeeHeader}>YEARLY FEE</Grid>
        </Grid>
        {operatorStore.operators.slice(0, batchIndex).map((operator: IOperator, operatorIndex) => {
          return (
              renderOperator({ operator, menu: true, key: operatorIndex })
          );
        })}
        {/* {loadingBatch && <div className={classes.menuLoader}></div>} */}
      </div>
    )}
    </div>
  );
};

export default observer(OperatorSelector);
