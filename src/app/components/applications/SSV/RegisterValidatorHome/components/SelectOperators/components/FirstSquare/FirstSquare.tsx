import { TableFooter } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useInfiniteQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from 'react-use';
import { CustomContainerComponentProps, CustomItemComponentProps, Virtualizer } from 'virtua';
import { translations } from '~app/common/config';
import { OperatorRow } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/OperatorRow';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/FirstSquare.styles';
import ClusterSize from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/ClusterSize/ClusterSize';
import Filters from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/Filters';
import StyledCell from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/StyledCell';
import BorderScreen from '~app/components/common/BorderScreen';
import Spinner from '~app/components/common/Spinner';
import TextInput from '~app/components/common/TextInput';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { IOperator } from '~app/model/operator.model';
import { fetchAndSetOperatorValidatorsLimit, getSelectedOperators, selectOperator, unselectOperator } from '~app/redux/operator.slice.ts';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { isDkgAddressValid } from '~lib/utils/operatorMetadataHelper';
import { cn } from '~lib/utils/tailwind';
import { getOperators as getOperatorsOperatorService } from '~root/services/operator.service';

export const COLUMN_WIDTHS = [80, 180, 100, 150, 180, 100, 100];

const FirstSquare = ({ editPage, clusterSize, setClusterSize, clusterBox }: { editPage: boolean; clusterSize: number; setClusterSize: Function; clusterBox: number[] }) => {
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dkgEnabled, selectDkgEnabled] = useState(false);

  const query = useInfiniteQuery({
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    queryKey: ['choose-operators-list', sortBy, sortOrder, filterBy, searchInput, dkgEnabled],
    queryFn: ({ pageParam }) => {
      const ordering: string = `${sortBy ? `${sortBy}:${sortOrder}` : 'id:asc'}`;
      return getOperatorsOperatorService({
        page: pageParam,
        ordering,
        dkgEnabled,
        perPage: 10,
        type: filterBy,
        search: searchInput
      }).then((response) => {
        if (pageParam === 1) scrollRef.current.scrollTop = 0;
        return response;
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    }
  });

  const operatorsData = useMemo(() => query.data?.pages.flatMap((page) => page.operators) ?? [], [query.data]);

  const filteredOperators = useMemo(() => {
    return !dkgEnabled
      ? operatorsData
      : operatorsData.filter(({ dkg_address }) => {
          return isDkgAddressValid(dkg_address ?? '');
        });
  }, [dkgEnabled, operatorsData]);

  const scrollRef: any = useRef(null);
  const classes = useStyles({ loading: query.isLoading });
  const dispatch = useAppDispatch();
  const selectedOperators = useAppSelector(getSelectedOperators);
  const selectedOperatorsMap = useMemo(() => new Map(Object.values(selectedOperators).map((o) => [o.public_key, o])), [selectedOperators]);

  const headers = [
    { type: '', displayName: '' },
    { type: 'name', displayName: 'Name', sortable: false },
    { type: 'validators_count', displayName: 'Validators', sortable: true },
    { type: 'performance.30d', displayName: '30d performance', sortable: true },
    { type: 'fee', displayName: 'Yearly Fee', sortable: true },
    { type: 'mev', displayName: 'MEV', sortable: true },
    { type: '', displayName: '', sortable: true }
  ];

  const selectOperatorHandling = (operator: IOperator) => {
    if (Object.values(selectedOperators).some((selectedOperator: IOperator) => selectedOperator.id === operator.id)) {
      for (const [key, value] of Object.entries(selectedOperators)) {
        if (JSON.stringify(value) === JSON.stringify(operator)) {
          dispatch(unselectOperator(Number(key)));
          return;
        }
      }
    }
    const indexes = clusterBox;
    let availableIndex: undefined | number;
    indexes.forEach((index: number) => {
      if (!selectedOperators[`${index}`] && !availableIndex) {
        availableIndex = index;
      }
    });
    if (availableIndex) {
      dispatch(selectOperator({ operator, selectedIndex: availableIndex, clusterBox }));
    }
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
        label: sortType
      });
      setSortBy(sortType);
      setSortOrder('desc');
    }
  };

  const inputHandler = debounce((e) => {
    const userInput = e.target.value.trim();
    if (userInput.length >= 1 || userInput.length === 0) {
      GoogleTagManager.getInstance().sendEvent({
        category: 'validator_register',
        action: 'search',
        label: userInput
      });
      setSearchInput(userInput);
    }
  }, 1000);

  useEffect(() => {
    dispatch(fetchAndSetOperatorValidatorsLimit());
  }, []);

  const [end, setEnd] = useState(0);
  useDebounce(
    () => {
      if (end + 18 > filteredOperators.length && query.hasNextPage && !query.isFetching) {
        query.fetchNextPage();
      }
    },
    20,
    [end]
  );

  return (
    <BorderScreen
      blackHeader
      withConversion
      withoutNavigation={editPage}
      wrapperClass={classes.ScreenWrapper}
      wrapperHeight={791}
      width={850}
      header={translations.VALIDATOR.SELECT_OPERATORS.TITLE}
      body={[
        <Grid container>
          <ClusterSize currentClusterSize={clusterSize} changeClusterSize={setClusterSize} />
          <Grid item container>
            <Grid item xs className={classes.SearchInputWrapper}>
              <TextInput
                withSideText
                placeHolder={'Search...'}
                onChangeCallback={inputHandler}
                sideIcon={query.isLoading ? <CircularProgress size={25} className={classes.Loading} /> : <div className={classes.SearchIcon} />}
              />
            </Grid>
            <Filters setFilterBy={setFilterBy} dkgEnabled={dkgEnabled} selectDkgEnabled={selectDkgEnabled} />
          </Grid>
          <TableContainer id={'scrollableDiv'} ref={scrollRef} className={classes.OperatorsTable}>
            {(query.isSuccess && !filteredOperators.length && (
              <Table>
                <TableBody>
                  <TableRow>
                    <StyledCell className={cn(classes.NoRecordsWrapper, 'border-b-0')}>
                      <Grid container>
                        <Grid item xs={12} className={classes.NoRecordImage} />
                        <Grid item xs={12} className={classes.NoRecordsText}>
                          No results found
                        </Grid>
                        <Grid item xs={12} className={classes.NoRecordsText}>
                          Please try different keyword or filter
                        </Grid>
                      </Grid>
                    </StyledCell>
                  </TableRow>
                </TableBody>
              </Table>
            )) || (
              <Virtualizer
                onRangeChange={(_, end) => setEnd(end)}
                count={filteredOperators.length}
                as={forwardRef<HTMLTableElement, CustomContainerComponentProps>(({ children, style }, ref) => {
                  return (
                    <Table
                      ref={ref}
                      style={{
                        position: 'relative',
                        height: style.height
                      }}
                      stickyHeader
                      aria-label="sticky table"
                    >
                      <TableHead>
                        <tr>
                          {headers &&
                            headers.map((header, index: number) => {
                              const sortByType = sortBy === header.type;
                              const ascending = sortOrder === 'asc';
                              const descending = sortOrder === 'desc';
                              let headerClasses = classes.SortArrow;
                              if (sortByType) {
                                if (ascending) headerClasses += ` ${classes.ArrowDown}`;
                                if (descending) headerClasses += ` ${classes.ArrowUp}`;
                              }
                              const width = COLUMN_WIDTHS[index];
                              return (
                                <StyledCell key={index} className={classes.HeaderWrapper} style={{ width }}>
                                  <Grid container onClick={() => header.sortable && sortHandler(header.type)}>
                                    <Grid item>{header.displayName}</Grid>
                                    {header.sortable && header.displayName !== '' && <Grid item className={headerClasses} />}
                                  </Grid>
                                </StyledCell>
                              );
                            })}
                        </tr>
                      </TableHead>
                      <TableBody style={{ ...style }}>{children}</TableBody>

                      <TableFooter>
                        {query.isFetching && (
                          <tr className="w-full h-12 relative">
                            <div className="w-full flex justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <Spinner />
                            </div>
                          </tr>
                        )}
                      </TableFooter>
                    </Table>
                  );
                })}
                item={forwardRef<HTMLTableRowElement, CustomItemComponentProps>(({ index, style }, ref) => {
                  const operator = filteredOperators[index];
                  const isSelected = selectedOperatorsMap.has(operator.public_key);
                  return <OperatorRow ref={ref} key={operator.public_key} style={style} operator={operator} isSelected={isSelected} onClick={selectOperatorHandling} />;
                })}
              >
                {(i) => <>{i}</>}
              </Virtualizer>
            )}
          </TableContainer>
        </Grid>
      ]}
    />
  );
};

export default FirstSquare;
