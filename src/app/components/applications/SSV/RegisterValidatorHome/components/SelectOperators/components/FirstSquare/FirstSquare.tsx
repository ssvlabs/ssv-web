import _ from 'underscore';
import { observer } from 'mobx-react';
import debounce from 'lodash/debounce';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import React, { useEffect, useRef, useState } from 'react';
import { CircularProgress, Grid } from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import Operator from '~lib/api/Operator';
import ApiParams from '~lib/api/ApiParams';
import { useStores } from '~app/hooks/useStores';
import ToolTip from '~app/components/common/ToolTip';
import { formatNumberToUi, roundNumber } from '~lib/utils/numbers';
import TextInput from '~app/components/common/TextInput';
import config, { translations } from '~app/common/config';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import BorderScreen from '~app/components/common/BorderScreen';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import Filters from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/Filters';
import StyledCell from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/StyledCell';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/FirstSquare.styles';
import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import EventStore from '~app/common/stores/applications/SsvWeb/Event.store';

const FirstSquare = ({ editPage }: { editPage: boolean }) => {
    const stores = useStores();
    const ssvStore: SsvStore = stores.SSV;
    const [loading, setLoading] = useState(false);
    const classes = useStyles({ loading });
    const wrapperRef = useRef(null);
    const eventStore: EventStore = stores.Event;
    const scrollRef: any = useRef(null);
    const walletStore: WalletStore = stores.Wallet;
    const [sortBy, setSortBy] = useState('');
    const operatorStore: OperatorStore = stores.Operator;
    const [filterBy, setFilterBy] = useState([]);
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
            { type: 'performance.30d', displayName: '30d performance' },
            { type: 'fee', displayName: 'Yearly Fee' },
            { type: '', displayName: '' },
        ];
        // skeletons = [0, 1, 2, 3, 4, 5, 6];
    }

    const getOperators = async (page: number) => {
        if (page > operatorsPagination.pages && operatorsPagination.pages !== 0) return;
        const ordering: string = `${sortBy ? `${sortBy}:${sortOrder}` : ''}`;

        const payload = {
            page,
            ordering,
            perPage: 10,
            type: filterBy,
            search: searchInput,
        };

        const response = await Operator.getInstance().getOperators(payload);

        if (response?.pagination?.page > 1) {
            setOperatorsData([...operatorsData, ...response.operators]);
        } else {
            setOperatorsData(response.operators);
        }

        setOperatorsPagination(response.pagination);
    };

    const selectOperator = (e: any, operator: IOperator) => {
        // @ts-ignore
        if (wrapperRef.current?.isEqualNode(e.target)) return;

        if (operatorStore.isOperatorSelected(operator.address)) {
            operatorStore.unselectOperatorByPublicKey(operator.address);
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
        window.open(`${config.links.LINK_EXPLORER}/operators/${pubKey}`, '_blank');
    };

    const sortHandler = (sortType: string) => {
        if (sortBy === sortType && sortOrder === 'asc') {
            setSortBy('');
            setSortOrder('desc');
        } else if (sortBy === sortType && sortOrder === 'desc') {
                setSortOrder('asc');
        } else {
            eventStore.send({ category: 'validator_register', action: 'filter', label: sortType });
            setSortBy(sortType);
            setSortOrder('desc');
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
        
        if (operatorsData?.length === 0 && !loading) {
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
            const isSelected = operatorStore.isOperatorSelected(operator.address);
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
                      <Grid item style={{ marginLeft: 4 }}>
                        <ToolTip text={'Operator reached  maximum amount of validators'} />
                      </Grid>
                    )}
                  </Grid>
                </StyledCell>
                <StyledCell>
                  <Grid container>
                    <Grid item>{roundNumber(operator.performance['30d'], 2)}</Grid>
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
                    <Grid item className={classes.FeeColumn}>{formatNumberToUi(ssvStore.newGetFeeForYear(walletStore.fromWei(operator.fee)))}</Grid>
                    {disabled && (
                      <Grid item style={{ alignSelf: 'center' }}>
                        <ToolTip text={'Operator reached  maximum amount of validators'} />
                      </Grid>
                    )}
                  </Grid>
                </StyledCell>
                )}
                <StyledCell>
                  <Grid ref={wrapperRef} className={classes.ChartIcon} onClick={() => { redirectTo(operator.address); }} />
                </StyledCell>
              </TableRow>
            );
        });
    };

    const updateValue = _.debounce(() => {
        if (loading) return;
        if (operatorsPagination.page <= operatorsPagination.pages) {
            const newPagination = Object.create(operatorsPagination);
            newPagination.page += 1;
            setOperatorsPagination(newPagination);
        }
    }, 200);

    const handleScroll = (event: any) => {
        const element = event.target;
        if (loading) return;
        if (element.scrollTop + element.offsetHeight > element.scrollHeight * 0.80) {
            updateValue();
        }
    };

    const inputHandler = debounce((e: any) => {
        const userInput = e.target.value.trim();
        if (userInput.length >= 3 || userInput.length === 0) {
            eventStore.send({ category: 'validator_register', action: 'search', label: userInput });
            setSearchInput(e.target.value.trim());
        }
    }, 1000);

    const rows: any = dataRows();

    useEffect(() => {
    }, [JSON.stringify(operatorStore.selectedOperators)]);

    useEffect(() => {
        setLoading(true);
        getOperators(1);
        setLoading(false);
        scrollRef.current.scrollTop = 0;
    }, [searchInput, sortBy, sortOrder, filterBy]);

    useEffect(() => {
        getOperators(operatorsPagination.page);
    }, [operatorsPagination.page]);

    return (
      <BorderScreen
        withoutNavigation={editPage}
        wrapperClass={classes.ScreenWrapper}
        body={[
          <Grid container>
            <HeaderSubHeader title={translations.VALIDATOR.SELECT_OPERATORS.TITLE} />
            <Grid item container>
              <Grid item xs className={classes.SearchInputWrapper}>
                <TextInput
                  withSideText
                  placeHolder={'Search...'}
                  onChangeCallback={inputHandler}
                  sideIcon={loading ? <CircularProgress size={25} className={classes.Loading} /> : <div className={classes.SearchIcon} />}
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
                            if (ascending) headerClasses += ` ${classes.ArrowDown}`;
                            if (descending) headerClasses += ` ${classes.ArrowUp}`;
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