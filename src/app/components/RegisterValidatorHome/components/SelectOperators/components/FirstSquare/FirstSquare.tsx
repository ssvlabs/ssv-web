import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import throttle from 'lodash/throttle';
import Table from '@material-ui/core/Table';
import { Skeleton } from '@material-ui/lab';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useRef, useState } from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import { CircularProgress, debounce, Grid } from '@material-ui/core';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
// import SsvStore from '~app/common/stores/SSV.store';
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
import ToolTip from '~app/common/components/ToolTip';

const FirstSquare = () => {
    console.log('<<<<<<<<<<<<<<<<render>>>>>>>>>>>>>>>>');
    let searchTimeout: any;
    const stores = useStores();
    const classes = useStyles();
    const SEARCH_TIMEOUT_DELAY = 700;
    // const ssvStore: SsvStore = stores.SSV;
    const wrapperRef = useRef(null);
    const walletStore: WalletStore = stores.Wallet;
    const [sortBy, setSortBy] = useState('');
    const operatorStore: OperatorStore = stores.Operator;
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('');
    const [filterBy, setFilterBy] = useState([]);
    const [batchIndex, setBatchIndex] = useState(20);
    const [operatorsData, setOperatorsData]: [any[], any] = useState([]);

    let headers = [
        { type: '', displayName: '' },
        { type: 'name', displayName: 'Name' },
        { type: 'validatorsCount', displayName: 'Validators' },
        { type: '', displayName: '' },
    ];
    let skeletons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    if (process.env.REACT_APP_NEW_STAGE) {
        headers = [
            { type: '', displayName: '' },
            { type: 'name', displayName: 'Name' },
            { type: 'validatorsCount', displayName: 'Validators' },
            { type: 'fee', displayName: 'Yearly Fee' },
            { type: '', displayName: '' },
        ];
        skeletons = [0, 1, 2, 3, 4, 5, 6];
    }

    useEffect(() => {
        operatorStore.loadOperators().then(() => {
            setOperatorsData(operatorStore.operators);
        });
    }, []);

    useEffect(() => {
    }, [sortBy, filterBy, JSON.stringify(operatorsData), JSON.stringify(operatorStore.selectedOperators)]);

    const fetch = React.useMemo(
        () => throttle((request: { input: string }, callback: any) => {
            setLoading(true);
            Operator.getInstance().search(request.input).then((results: any) => {
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

    const selectOperator = (e: any, operator: IOperator) => {
        // @ts-ignore
        if (wrapperRef.current?.isEqualNode(e.target)) return;

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

    const sortHandler = (sortType: string) => {
        if (sortBy === sortType && sortOrder === 'ascending') {
            setSortOrder('descending');
        } else if (sortBy === sortType && sortOrder === 'descending') {
            setSortBy('');
            setSortOrder('ascending');
        } else {
            setSortBy(sortType);
            setSortOrder('ascending');
        }
    };

    const inputSearch = (e: any) => {
        const userInput = e.target.value.trim();
        if (userInput === '') {
            setBatchIndex(20);
            setOperatorsData(operatorStore.operators);
        }
        if (userInput.length < 3) {
            return;
        }

        searchTimeout && clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetch({ input: userInput }, (results: any) => {
                setLoading(false);
                if (e.target.value.trim() === '') return;
                setOperatorsData(results);
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
        if (operatorStore.loadingOperators) {
            return skeletons.map((rowIndex: number) => (
              <StyledRow hover role="checkbox" tabIndex={-1} key={`row-${rowIndex}`}>
                {[0, 1, 2, 3].map((index: number) => (
                  <StyledCell style={{ padding: '10px 2px 10px 2px' }} key={`cell-${index}`}>
                    <Skeleton />
                  </StyledCell>
                ))}
              </StyledRow>
            ));
        }

        let operatorsDataShell = operatorsData.slice(0);

        if (sortBy) {
            operatorsDataShell = operatorsDataShell.sort((a, b) => {
                if (sortBy === 'name') {
                    const aName = a[sortBy].toLowerCase();
                    const bName = b[sortBy].toLowerCase();
                    if (sortOrder === 'ascending') {
                        if (aName < bName) { return -1; }
                        if (aName > bName) { return 1; }
                    } else {
                        if (aName > bName) { return -1; }
                        if (aName < bName) { return 1; }
                    }
                } else if (sortOrder === 'ascending') {
                        if (a[sortBy] > b[sortBy]) { return -1; }
                        if (a[sortBy] > b[sortBy]) { return 1; }
                    } else {
                        if (a[sortBy] < b[sortBy]) { return -1; }
                        if (a[sortBy] > b[sortBy]) { return 1; }
                    }
                return 0;
            });
        }

        if (filterBy.length > 0) {
            operatorsDataShell = operatorsDataShell.filter((operator: IOperator) => {
                let typeExist = false;
                // eslint-disable-next-line no-restricted-syntax
                for (const filter of filterBy) {
                    if (operator.type === filter) {
                        typeExist = true;
                    }
                }
                return typeExist;
            });
        }

        if (operatorsDataShell.length === 0) {
            return (
              <TableRow hover>
                <StyledCell className={classes.NoRecordsWrapper}>
                  <Grid container>
                    <Grid item xs={12} className={classes.NoRecordImage} />
                    <Grid item xs={12} className={classes.NoRecordsText}>No results found</Grid>
                    <Grid item xs={12} className={classes.NoRecordsText}>Please try different keyword or filter</Grid>
                  </Grid>
                </StyledCell>
              </TableRow>
            );
        }

        return operatorsDataShell.slice(0, batchIndex).map((operator) => {
            const isSelected = operatorStore.isOperatorSelected(operator.pubkey);
            const disabled = !operatorStore.isOperatorRegistrable(operator.validatorsCount);
            return (
              <TableRow
                key={operator.pubkey}
                className={`${classes.RowWrapper} ${isSelected ? classes.Selected : ''} ${disabled ? classes.RowDisabled : ''}`}
                onClick={(e) => {
                        !disabled && selectOperator(e, operator);
                    }}
                >
                <StyledCell style={{ width: 60 }}>
                  <Grid item className={`${classes.Checkbox} ${isSelected ? classes.Checked : ''}`} />
                </StyledCell>
                <StyledCell>
                  <OperatorDetails operator={operator} />
                </StyledCell>
                <StyledCell>
                  <Grid container>
                    <Grid item>{operator.validatorsCount}</Grid>
                    {disabled && (
                    <Grid item style={{ alignSelf: 'center' }}>
                      <ToolTip text={'Operator reached  maximum amount of validators'} />
                    </Grid>
                    )}
                  </Grid>
                </StyledCell>
                <StyledCell>
                  <Grid container>
                    <Grid item>{operator.fee}</Grid>
                    {disabled && (
                      <Grid item style={{ alignSelf: 'center' }}>
                        <ToolTip text={'Operator reached  maximum amount of validators'} />
                      </Grid>
                          )}
                  </Grid>
                </StyledCell>
                <StyledCell>
                  <Grid ref={wrapperRef} className={classes.ChartIcon} onClick={() => { redirectTo(operator.pubkey); }} />
                </StyledCell>
              </TableRow>
            );
        });
    };

    const rows: any = dataRows();

    return (
      <BorderScreen
        wrapperClass={classes.ScreenWrapper}
        navigationLink={config.routes.VALIDATOR.IMPORT}
        body={[
          <Grid container>
            <HeaderSubHeader title={translations.VALIDATOR.SELECT_OPERATORS.TITLE} />
            <Grid item container>
              <Grid item xs className={classes.SearchInputWrapper}>
                <TextInput
                  withSideText
                  onChange={inputSearch}
                  sideIcon={loading ? <CircularProgress size={25} className={classes.Loading} /> : <div className={classes.SearchIcon} />}
                  placeHolder={'Search...'}
                />
              </Grid>
              <Filters setFilterBy={setFilterBy} />
            </Grid>
            <TableContainer className={classes.OperatorsTable} onScroll={lazyLoad}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {rows.length > 0 && headers.map((header: any, index: number) => {
                        const sortByType = sortBy === header.type;
                        const ascending = sortOrder === 'ascending';
                        const descending = sortOrder === 'descending';
                        let headerClasses = classes.SortArrow;
                        if (sortByType) {
                            if (descending) headerClasses += ` ${classes.ArrowUp}`;
                            if (ascending) headerClasses += ` ${classes.ArrowDown}`;
                        }

                          return (
                            <StyledCell key={index} className={classes.HeaderWrapper}>
                              <Grid container onClick={() => sortHandler(header.type)}>
                                <Grid item>{header.displayName}</Grid>
                                {header.displayName !== '' && (
                                  <Grid
                                    item
                                    className={headerClasses}
                                  />
                                )}
                              </Grid>
                            </StyledCell>
                          );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>,
        ]}
      />
    );
};

export default observer(FirstSquare);
