import _ from 'underscore';
import { observer } from 'mobx-react';
import debounce from 'lodash/debounce';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import React, { useEffect, useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Operator from '~lib/api/Operator';
import ApiParams from '~lib/api/ApiParams';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/components/common/Status';
import ToolTip from '~app/components/common/ToolTip';
import Checkbox from '~app/components/common/CheckBox';
import TextInput from '~app/components/common/TextInput';
import config, { translations } from '~app/common/config';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import BorderScreen from '~app/components/common/BorderScreen';
import { formatNumberToUi, roundNumber } from '~lib/utils/numbers';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import Filters
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/Filters';
import StyledCell
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/StyledCell';
import {
  useStyles,
} from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/FirstSquare.styles';
import OperatorDetails
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';

const FirstSquare = ({ editPage }: { editPage: boolean }) => {
  const stores = useStores();
  const ssvStore: SsvStore = stores.SSV;
  const [loading, setLoading] = useState(false);
  const classes = useStyles({ loading });
  const wrapperRef = useRef(null);
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

  headers = [
    { type: '', displayName: '' },
    { type: 'name', displayName: 'Name' },
    { type: 'validators_count', displayName: 'Validators' },
    { type: 'performance.30d', displayName: '30d performance' },
    { type: 'fee', displayName: 'Yearly Fee' },
    { type: '', displayName: '' },
  ];
  // skeletons = [0, 1, 2, 3, 4, 5, 6];

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

    if (operatorStore.isOperatorSelected(operator.id)) {
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
    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: 'operator',
    });
    window.open(`${config.links.EXPLORER_URL}/operators/${pubKey}/?version=${config.links.EXPLORER_VERSION}&network=${config.links.EXPLORER_NETWORK}`, '_blank');
  };

  const sortHandler = (sortType: string) => {
    if (sortBy === sortType && sortOrder === 'asc') {
      setSortBy('');
      setSortOrder('desc');
    } else if (sortBy === sortType && sortOrder === 'desc') {
      setSortOrder('asc');
    } else {
      GoogleTagManager.getInstance().sendEvent({
        category: 'validator_register',
        action: 'sort',
        label: sortType,
      });
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
                <Grid item xs={12} className={classes.NoRecordImage}/>
                <Grid item xs={12} className={classes.NoRecordsText}>No results found</Grid>
                <Grid item xs={12} className={classes.NoRecordsText}>Please try different keyword or filter</Grid>
              </Grid>
            </StyledCell>
          </TableRow>
      );
    }

    return operatorsData.map((operator) => {
      const isDeleted = operator.is_deleted;
      const isSelected = operatorStore.isOperatorSelected(operator.id);
      const reachedMaxValidators = !operatorStore.isOperatorRegistrable(operator.validators_count);
      const disabled = reachedMaxValidators || isDeleted;
      const disableCheckBoxes = operatorStore.selectedEnoughOperators;
      const isInactive = operator.status.toLowerCase() === 'inactive';

      return (
          <TableRow
              key={Math.floor(Math.random() * 10000000)}
              className={`${classes.RowWrapper} ${isSelected ? classes.Selected : ''} ${disabled ? classes.RowDisabled : ''}`}
              onClick={(e) => {
                !disabled && selectOperator(e, operator);
              }}
          >
            <StyledCell style={{ paddingLeft: 20, width: 60 }}>
              <Checkbox disable={disableCheckBoxes && !isSelected} grayBackGround text={''} isChecked={isSelected}/>
            </StyledCell>
            <StyledCell>
              <OperatorDetails operator={operator}/>
            </StyledCell>
            <StyledCell>
              <Grid container>
                <Grid item>{operator.validators_count}</Grid>
                {reachedMaxValidators && (
                    <Grid item style={{ marginLeft: 4 }}>
                      <ToolTip text={'Operator reached  maximum amount of validators'}/>
                    </Grid>
                )}
              </Grid>
            </StyledCell>
            <StyledCell>
              <Grid container>
                <Grid item
                      className={isInactive ? classes.Inactive : ''}>{roundNumber(operator.performance['30d'], 2)}%</Grid>
                {isInactive && (
                    <Grid item xs={12}>
                      <Status status={operator.status}/>
                    </Grid>
                )}
              </Grid>
            </StyledCell>
            <StyledCell>
              <Grid container>
                <Grid item
                      className={classes.FeeColumn}>{formatNumberToUi(ssvStore.newGetFeeForYear(walletStore.fromWei(operator.fee)))} SSV</Grid>
                {disabled && (
                    <Grid item style={{ alignSelf: 'center' }}>
                      <ToolTip text={'Operator reached  maximum amount of validators'}/>
                    </Grid>
                )}
              </Grid>
            </StyledCell>
            <StyledCell>
              <Grid ref={wrapperRef} className={classes.ChartIcon} onClick={() => {
                redirectTo(operator.address);
              }}/>
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
      GoogleTagManager.getInstance().sendEvent({
        category: 'validator_register',
        action: 'search',
        label: userInput,
      });
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
          blackHeader
          withConversion
          withoutNavigation={editPage}
          wrapperClass={classes.ScreenWrapper}
          header={translations.VALIDATOR.SELECT_OPERATORS.TITLE}
          body={[
            <Grid container>
              <Grid item container>
                <Grid item xs className={classes.SearchInputWrapper}>
                  <TextInput
                      withSideText
                      placeHolder={'Search...'}
                      onChangeCallback={inputHandler}
                      sideIcon={loading ? <CircularProgress size={25} className={classes.Loading}/> :
                          <div className={classes.SearchIcon}/>}
                  />
                </Grid>
                <Filters setFilterBy={setFilterBy}/>
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
