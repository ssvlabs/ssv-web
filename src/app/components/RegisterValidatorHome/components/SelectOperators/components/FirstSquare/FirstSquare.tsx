import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import debounce from 'lodash/debounce';
import Table from '@material-ui/core/Table';
// import { Skeleton } from '@material-ui/lab';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import { CircularProgress, Grid } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import _ from 'underscore';
import Operator from '~lib/api/Operator';
import ApiParams from '~lib/api/ApiParams';
import { useStores } from '~app/hooks/useStores';
import ToolTip from '~app/common/components/ToolTip';
import TextInput from '~app/common/components/TextInput';
import config, { translations } from '~app/common/config';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import Filters from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/Filters';
// import StyledRow from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/StyledRow';
import StyledCell from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/StyledCell';
import { useStyles } from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/FirstSquare.styles';
import OperatorDetails from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';

const FirstSquare = () => {
    const stores = useStores();
    const classes = useStyles();
    const wrapperRef = useRef(null);
    const scrollRef: any = useRef(null);
    const walletStore: WalletStore = stores.Wallet;
    const [sortBy, setSortBy] = useState('');
    const operatorStore: OperatorStore = stores.Operator;
    const [filterBy, setFilterBy] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [operatorsData, setOperatorsData]: [any[], any] = useState([]);
    const [operatorsPagination, setOperatorsPagination] = useState(ApiParams.DEFAULT_PAGINATION);

    let headers = [
        { type: '', displayName: '' },
        { type: 'name', displayName: 'Name' },
        { type: 'validators_count', displayName: 'Validators' },
        { type: '', displayName: '' },
    ];
    // const skeletons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    if (process.env.REACT_APP_NEW_STAGE) {
        headers = [
            { type: '', displayName: '' },
            { type: 'name', displayName: 'Name' },
            { type: 'validators_count', displayName: 'Validators' },
            { type: 'fee', displayName: 'Yearly Fee' },
            { type: '', displayName: '' },
        ];
        // skeletons = [0, 1, 2, 3, 4, 5, 6];
    }

    const getOperators = (page: number) => {
        if (page > operatorsPagination.pages) return;
        const ordering: string = `type${sortBy || sortOrder ? `,${sortBy}:${sortOrder}` : ''}`;
        const payload = {
            page,
            ordering,
            perPage: 10,
            type: filterBy,
            search: searchInput,
            validatorsCount: true,
        };
        setLoading(true);

        Operator.getInstance().getOperators(payload).then((response: any) => {
            if (response.pagination.page > 1) {
                setOperatorsData([...operatorsData, ...response.operators]);
            } else {
                setOperatorsData(response.operators);
            }

            setOperatorsPagination(response.pagination);
            if (response.pagination.page === 1 && scrollRef.current) {
                scrollRef.current.scrollTo(0, 0);
            }
            setLoading(false);
        });
    };

    const selectOperator = (e: any, operator: IOperator) => {
        // @ts-ignore
        if (wrapperRef.current?.isEqualNode(e.target)) return;

        if (operatorStore.isOperatorSelected(operator.public_key)) {
            operatorStore.unselectOperatorByPublicKey(operator.public_key);
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
        if (sortBy === sortType && sortOrder === 'asc') {
            setSortOrder('desc');
        } else if (sortBy === sortType && sortOrder === 'desc') {
            setSortBy('');
            setSortOrder('asc');
        } else {
            setSortBy(sortType);
            setSortOrder('asc');
        }
    };

    const dataRows = () => {
        // if (loading) {
        //     return skeletons.map((rowIndex: number) => (
        //       <StyledRow hover role="checkbox" tabIndex={-1} key={`row-${rowIndex}`}>
        //         {[0, 1, 2, 3].map((index: number) => (
        //           <StyledCell style={{ padding: '10px 2px 10px 2px' }} key={`cell-${index}`}>
        //             <Skeleton />
        //           </StyledCell>
        //         ))}
        //       </StyledRow>
        //     ));
        // }
        // if (loading) return [];

        if (operatorsData.length === 0 && !loading) {
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

        return operatorsData.map((operator) => {
            const isSelected = operatorStore.isOperatorSelected(operator.public_key);
            const disabled = !operatorStore.isOperatorRegistrable(operator.validators_count);
            return (
              <TableRow
                key={Math.floor(Math.random() * 10000000)}
                className={`${classes.RowWrapper} ${isSelected ? classes.Selected : ''} ${disabled ? classes.RowDisabled : ''}`}
                onClick={(e) => { !disabled && selectOperator(e, operator); }}
              >
                <StyledCell style={{ width: 60 }}>
                  <Grid item className={`${classes.Checkbox} ${isSelected ? classes.Checked : ''}`} />
                </StyledCell>
                <StyledCell>
                  <OperatorDetails operator={operator} />
                </StyledCell>
                <StyledCell>
                  <Grid container>
                    <Grid item>{operator.validators_count}</Grid>
                    {disabled && (
                    <Grid item style={{ alignSelf: 'center' }}>
                      <ToolTip text={'Operator reached  maximum amount of validators'} />
                    </Grid>
                    )}
                  </Grid>
                </StyledCell>
                {process.env.REACT_APP_NEW_STAGE && (
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
                )}
                <StyledCell>
                  <Grid ref={wrapperRef} className={classes.ChartIcon} onClick={() => { redirectTo(operator.pubkey); }} />
                </StyledCell>
              </TableRow>
            );
        });
    };

    const updateValue = _.debounce((e: any) => {
        const element = e.target;
        if (loading) return;
        if (element.scrollTop + element.offsetHeight > element.scrollHeight - 100 && operatorsPagination.page <= operatorsPagination.pages) {
            const newPagination = Object.create(operatorsPagination);
            newPagination.page += 1;
            console.log(newPagination);
            setOperatorsPagination(newPagination);
        }
    }, 700);

    const handleScroll = (event: any) => {
        const element = event.target;
        if (loading) return;
        if (element.scrollTop + element.offsetHeight > element.scrollHeight) {
            updateValue(event);
        }
    };

    const inputHandler = debounce((e: any) => {
        setSearchInput(e.target.value.trim());
    }, 1000);

    const rows: any = dataRows();

    useEffect(() => {
    }, [JSON.stringify(operatorStore.selectedOperators)]);

    useEffect(() => {
        getOperators(1);
    }, [searchInput, sortBy, sortOrder, filterBy]);

    useEffect(() => {
        getOperators(operatorsPagination.page);
    }, [operatorsPagination.page]);

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
                  onChangeCallback={inputHandler}
                  sideIcon={loading ? <CircularProgress size={25} className={classes.Loading} /> : <div className={classes.SearchIcon} />}
                  placeHolder={'Search...'}
                />
              </Grid>
              <Filters setFilterBy={setFilterBy} />
            </Grid>
            <TableContainer className={classes.OperatorsTable} ref={scrollRef} onScroll={handleScroll}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {rows.length > 0 && headers.map((header: any, index: number) => {
                        const sortByType = sortBy === header.type;
                        const ascending = sortOrder === 'asc';
                        const descending = sortOrder === 'desc';
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
