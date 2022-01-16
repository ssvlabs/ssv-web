import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { debounce } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import config from '~app/common/config';
import Fee from '~app/common/components/Fee';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import NameAndAddress from '~app/common/components/NameAndAddress';
import OperatorStore, { IOperator } from '~app/common/stores/Operator.store';
// import LinearProgress from '@material-ui/core/LinearProgress';
import { useStyles } from './SelectOperator.styles';

type OperatorSelectorProps = {
  dataTestid: string,
  index: number
  openMenuWithIndex: any,
  shouldOpenMenu: boolean,
  indexedOperator: IOperator,
};

const SelectOperator = ({ indexedOperator, shouldOpenMenu, openMenuWithIndex, index, dataTestid }: OperatorSelectorProps) => {
  const stores = useStores();
  const classes = useStyles();
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
              <Grid item className={classes.NameAndAddressWrapper}>
                <NameAndAddress styleAddressClass={classes.Address} name={operator.name} address={operatorAddressSeralize(sha256(walletStore.decodeKey(operator.pubkey)))} />
              </Grid>
              <Grid item onClick={() => { !operatorSelected && onSelectOperator(operator); }}>
                {operator.verified || operator.dappNode ? (
                  <Grid container className={operator.verified ? classes.verifiedText : classes.DappNode}>
                    <Grid item>
                      {operator.verified ? 'Verified' : 'DAppNode'}
                    </Grid>
                    <Grid item>
                      {operator.verified && <Grid className={classes.VerifiedIcon} />}
                      {operator.dappNode && <Grid className={classes.DappNodeIcon} />}
                    </Grid>
                  </Grid>
                ) : ''}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {process.env.REACT_APP_NEW_STAGE && (
        <Grid item container xs>
          <Fee className={classes.Fee} publicKey={operator.pubkey} />
          <Grid className={classes.FeeDollar}>
            ~$757.5
          </Grid>
        </Grid>
        )}
        <Grid item xs style={{ alignSelf: process.env.REACT_APP_NEW_STAGE ? '' : 'center' }}>
          <Grid container className={classes.verifiedWrapper} justify={'flex-end'}>
            <Grid item onClick={() => {
                redirectTo(operator.pubkey);
              }}>
              <Grid className={classes.chartIcon} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid key={index}>
      <button 
        data-testid={dataTestid}
        className={`${classes.selectButton} ${shouldOpenMenu && classes.selected}`}
        onClick={closeMenu}
      >
        {selectedOperator ? (
                renderOperator({ operator: selectedOperator, menu: false })
            )
            : (
              <Grid className={classes.SelectOperatorHeader}>
                Select Operator
                <img src={getImage('arrow_up_icon.svg')}
                  className={`${classes.buttonArrow} ${shouldOpenMenu && classes.arrowSelected}`} />
              </Grid>
            )
        }
      </button>
      {shouldOpenMenu && (
      <div className={classes.menuWrapper} onScroll={lazyLoad}>
        <Grid container className={classes.DropDownMenuHeader}>
          <Grid item xs={6}>Operators Name</Grid>
          {process.env.REACT_APP_NEW_STAGE && <Grid item className={classes.YearlyFeeHeader}>Yearly Fee</Grid>}
        </Grid>
        {operatorStore.operators.slice(0, batchIndex).map((operator: IOperator, operatorIndex) => {
          return (
              renderOperator({ operator, menu: true, key: operatorIndex })
          );
        })}
        {/* {loadingBatch && <div className={classes.menuLoader}></div>} */}
      </div>
    )}
    </Grid>
  );
};

export default observer(SelectOperator);
