import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import throttle from 'lodash/throttle';
import Table from '@material-ui/core/Table';
import { Skeleton } from '@material-ui/lab';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import { debounce, Grid } from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Operators from '~lib/api/Operators';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/SSV.store';
import TextInput from '~app/common/components/TextInput';
import config, { translations } from '~app/common/config';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import OperatorStore, { IOperator } from '~app/common/stores/Operator.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import Filters from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/Filters';
import StyledRow from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/StyledRow';
import StyledCell from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/StyledCell';
import { useStyles } from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/FirstSquare.styles';
import OperatorDetails from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';

const FirstSquare = () => {
    let searchTimeout: any;
    const stores = useStores();
    const classes = useStyles();
    const SEARCH_TIMEOUT_DELAY = 700;
    const ssvStore: SsvStore = stores.SSV;
    // const [loading, setLoading] = useState(false);
    const walletStore: WalletStore = stores.Wallet;
    const operatorStore: OperatorStore = stores.Operator;
    const [batchIndex, setBatchIndex] = useState(20);
    const [sortBy, setSortBy] = useState('');
    const [operatorsData, setOperatorsData]: [any[], any] = useState([]);
    const [shellOperatorsData, setShellOperatorsData]: [any[], any] = useState([]);

    let headers = [
        { type: '', displayName: '' },
        { type: 'name', displayName: 'Name' },
        { type: '', displayName: '' },
    ];
    let skeletons = [0, 1, 2, 3, 4];
    if (process.env.REACT_APP_NEW_STAGE) {
        headers = [
            { type: '', displayName: '' },
            { type: 'name', displayName: 'Name' },
            { type: 'fee', displayName: 'Yearly Fee' },
            { type: '', displayName: '' },
        ];
        skeletons = [0, 1, 2, 3, 4, 5, 6];
    }

    const assignData = (data: IOperator[]) => {
        setOperatorsData(data);
        setShellOperatorsData(data);
    };

    const sort = (type: string) => {
        if (type === sortBy) {
            setSortBy('');
            setOperatorsData(shellOperatorsData);
            return;
        }
            const sortedArray = operatorsData.sort((a, b) => {
                if (a[type] < b[type]) { return -1; }
                if (a[type] > b[type]) { return 1; }
                return 0;
            });
            setOperatorsData(sortedArray);
            setSortBy(type);
    };

    const fetch = React.useMemo(
        () => throttle((request: { input: string }, callback: any) => {
            // setLoading(true);
            Operators.getInstance().search(request.input).then((results: any) => {
                const operators: any = [];
                (results?.operators || []).forEach((operator: any) => {
                    const hashedOperator = operatorStore.hashedOperators[operator.public_key];
                    if (hashedOperator) {
                        operators.push(hashedOperator);
                    }
                });
                callback(operators);
            });
        }, 200),
        [],
    );

    useEffect(() => {
        operatorStore.unselectAllOperators();
        operatorStore.loadOperators().then(() => {
            assignData(operatorStore.operators);
        });
    }, []);

    useEffect(() => {
    }, [JSON.stringify(operatorsData), JSON.stringify(operatorStore.selectedOperators)]);

    const selectOperator = (operator: IOperator) => {
        if (operatorStore.isOperatorSelected(operator.pubkey)) {
            operatorStore.unselectOperatorByPublicKey(operator.pubkey);
          return;
        }
        const indexes = [1, 2, 3, 4];
        let availableIndex: undefined | number;
        indexes.forEach((index: number) => {
            if (!operatorStore.selectedOperators[index] && !availableIndex) {
                availableIndex = index;
            }
        });
        if (availableIndex) {
            operatorStore.selectOperator(operator, availableIndex);
        }
    };

    const redirectTo = (pubKey: string) => {
        window.open(`${config.links.LINK_EXPLORER}/operators/${sha256(walletStore.decodeKey(pubKey))}`);
    };

    const inputSearch = (e: any) => {
        const userInput = e.target.value.trim();
        if (userInput === '') {
            setBatchIndex(20);
            assignData(operatorStore.operators);
        }
        if (userInput.length < 3) {
            return;
        }

        searchTimeout && clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetch({ input: userInput }, (results: any) => {
                assignData(results);
                // setLoading(false);
            });
        }, SEARCH_TIMEOUT_DELAY);
    };

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

    const dataRows = () => {
        if (operatorStore.loadingOperator) {
            return skeletons.map((rowIndex: number) => (
              <StyledRow hover role="checkbox" tabIndex={-1} key={`row-${rowIndex}`}>
                {[0, 1, 2, 3, 4].map((index: number) => (
                  <StyledCell key={`cell-${index}`}>
                    <Skeleton />
                  </StyledCell>
                ))}
              </StyledRow>
            ));
        }

        if (operatorsData.length === 0) {
            return (
              <TableRow hover>
                <StyledCell className={classes.NoRecordsWrapper}>
                  <Grid container>
                    <Grid item xs={12} className={classes.NoRecordImage} />
                    <Grid item xs={12} className={classes.NoRecordsText}>No results found</Grid>
                    <Grid item xs={12} className={classes.NoRecordsText}>Please try different keyword/filter</Grid>
                  </Grid>
                </StyledCell>
              </TableRow>
            );
        }

        return operatorsData.slice(0, batchIndex).map((operator) => {
            const isSelected = operatorStore.isOperatorSelected(operator.pubkey);
            if (!process.env.REACT_APP_NEW_STAGE) {
                return (
                  <TableRow key={operator.pubkey} className={`${classes.RowWrapper} ${isSelected ? classes.Selected : ''}`} onClick={() => { selectOperator(operator); }}>
                    <StyledCell>
                      <Grid item className={`${classes.Checkbox} ${isSelected ? classes.Checked : ''}`} />
                    </StyledCell>
                    <StyledCell>
                      <OperatorDetails operator={operator} />
                    </StyledCell>
                    <StyledCell>
                      <Grid className={classes.ChartIcon} onClick={() => { redirectTo(operator.pubkey); }} />
                    </StyledCell>
                  </TableRow>
                );
            }
                return (
                  <TableRow key={operator.pubkey} className={`${classes.RowWrapper} ${isSelected ? classes.Selected : ''}`} onClick={() => { !isSelected && selectOperator(operator); }}>
                    <StyledCell>
                      <Grid item className={`${classes.Checkbox} ${isSelected ? classes.Checked : ''}`} />
                    </StyledCell>
                    <StyledCell>
                      <OperatorDetails operator={operator} />
                    </StyledCell>
                    <StyledCell>{ssvStore.getFeeForYear(operator.fee)}</StyledCell>
                    <StyledCell>
                      <Grid className={classes.ChartIcon} onClick={() => { redirectTo(operator.pubkey); }} />
                    </StyledCell>
                  </TableRow>
                );
        });
    };

    return (
      <BorderScreen
        wrapperClass={classes.ScreenWrapper}
        link={{ to: config.routes.VALIDATOR.IMPORT, text: 'Back' }}
        body={[
          <Grid container>
            <HeaderSubHeader title={translations.VALIDATOR.SELECT_OPERATORS.TITLE} />
            <Grid item container>
              <Grid item xs className={classes.SearchInputWrapper}>
                <TextInput
                  withSideText
                  onChange={inputSearch}
                  sideIcon={<div className={classes.SearchIcon} />}
                  placeHolder={'Search...'}
                />
              </Grid>
              <Filters data={shellOperatorsData} setResultFiltered={setOperatorsData} />
            </Grid>
            <TableContainer className={classes.OperatorsTable} onScroll={lazyLoad}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {operatorsData.length > 0 && headers.map((header: any, index: number) => (
                      <StyledCell key={index} className={classes.HeaderWrapper}>
                        <Grid container onClick={() => sort(header.type)}>
                          <Grid item>{header.displayName}</Grid>
                          {header.displayName !== '' && (
                            <Grid
                              item
                              className={`${classes.SortArrow} ${sortBy === header.type ? classes.SelectedSort : ''}`}
                            />
                          )}
                        </Grid>
                      </StyledCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataRows()}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>,
        ]}
      />
    );
};

export default observer(FirstSquare);
