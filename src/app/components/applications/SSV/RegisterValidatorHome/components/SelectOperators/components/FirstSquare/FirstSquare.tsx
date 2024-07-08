import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import debounce from 'lodash/debounce';
import { ReactElement, useEffect, useRef, useState } from 'react';
import _ from 'underscore';
import { translations } from '~app/common/config';
import { DEFAULT_PAGINATION } from '~app/common/config/config';
import { OperatorRow } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/OperatorRow';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/FirstSquare.styles';
import ClusterSize from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/ClusterSize/ClusterSize';
import Filters from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/Filters';
import StyledCell from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/StyledCell';
import BorderScreen from '~app/components/common/BorderScreen';
import TextInput from '~app/components/common/TextInput';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { IOperator } from '~app/model/operator.model';
import { fetchAndSetOperatorValidatorsLimit, getSelectedOperators, selectOperator, unselectOperator } from '~app/redux/operator.slice.ts';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { isDkgAddressValid } from '~lib/utils/operatorMetadataHelper';
import { getOperators as getOperatorsOperatorService } from '~root/services/operator.service';

const FirstSquare = ({ editPage, clusterSize, setClusterSize, clusterBox }: { editPage: boolean; clusterSize: number; setClusterSize: Function; clusterBox: number[] }) => {
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [operatorsData, setOperatorsData] = useState<IOperator[]>([]);
  const [operatorsPagination, setOperatorsPagination] = useState(DEFAULT_PAGINATION);
  const [dkgEnabled, selectDkgEnabled] = useState(false);

  const filteredOperators = !dkgEnabled
    ? operatorsData
    : operatorsData.filter(({ dkg_address }) => {
        return isDkgAddressValid(dkg_address ?? '');
      });

  const scrollRef: any = useRef(null);
  const classes = useStyles({ loading });
  const dispatch = useAppDispatch();
  const selectedOperators = useAppSelector(getSelectedOperators);

  const headers = [
    { type: '', displayName: '' },
    { type: 'name', displayName: 'Name', sortable: false },
    { type: 'validators_count', displayName: 'Validators', sortable: true },
    { type: 'performance.30d', displayName: '30d performance', sortable: true },
    { type: 'fee', displayName: 'Yearly Fee', sortable: true },
    { type: 'mev', displayName: 'MEV', sortable: true },
    { type: '', displayName: '', sortable: true }
  ];

  const getOperators = async (page: number) => {
    if (page > operatorsPagination.pages && operatorsPagination.pages !== 0) return;
    const ordering: string = `${sortBy ? `${sortBy}:${sortOrder}` : 'id:asc'}`;

    const payload = {
      page,
      ordering,
      dkgEnabled,
      perPage: 10,
      type: filterBy,
      search: searchInput
    };

    const response = await getOperatorsOperatorService(payload);
    if (response?.pagination?.page > 1) {
      const operatorListInString = operatorsData.map((operator) => operator.id);
      const operators = response.operators.filter((operator: any) => !operatorListInString.includes(operator.id));
      setOperatorsData([...operatorsData, ...operators]);
    } else {
      setOperatorsData(response.operators);
    }
    setOperatorsPagination(response.pagination);
  };

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

  const dataRows = (): ReactElement | ReactElement[] => {
    if (filteredOperators?.length === 0 && !loading) {
      return (
        <TableRow hover>
          <StyledCell className={classes.NoRecordsWrapper}>
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
      );
    }

    return filteredOperators.map((operator: IOperator) => {
      const isSelected = Object.values(selectedOperators).some((selectedOperator: IOperator) => selectedOperator.id === operator.id);
      return <OperatorRow key={operator.public_key} operator={operator} isSelected={isSelected} onClick={selectOperatorHandling} />;
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
    if (element.scrollTop + element.offsetHeight > element.scrollHeight * 0.8) {
      updateValue();
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

  const rows = dataRows();

  useEffect(() => {
    setLoading(true);
    getOperators(1).then(() => {
      setLoading(false);
      scrollRef.current.scrollTop = 0;
    });
  }, [searchInput, sortBy, sortOrder, filterBy]);

  useEffect(() => {
    getOperators(operatorsPagination.page).then(async () => {
      await dispatch(fetchAndSetOperatorValidatorsLimit());
    });
  }, [operatorsPagination.page]);

  return (
    <BorderScreen
      blackHeader
      withConversion
      withoutNavigation={editPage}
      wrapperClass={classes.ScreenWrapper}
      wrapperHeight={791}
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
                sideIcon={loading ? <CircularProgress size={25} className={classes.Loading} /> : <div className={classes.SearchIcon} />}
              />
            </Grid>
            <Filters setFilterBy={setFilterBy} dkgEnabled={dkgEnabled} selectDkgEnabled={selectDkgEnabled} />
          </Grid>
          <TableContainer className={classes.OperatorsTable} ref={scrollRef} onScroll={handleScroll}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {'length' in rows &&
                    rows.length > 0 &&
                    headers.map((header, index: number) => {
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
                          <Grid container onClick={() => header.sortable && sortHandler(header.type)}>
                            <Grid item>{header.displayName}</Grid>
                            {header.sortable && header.displayName !== '' && <Grid item className={headerClasses} />}
                          </Grid>
                        </StyledCell>
                      );
                    })}
                </TableRow>
              </TableHead>
              <TableBody>{rows}</TableBody>
            </Table>
          </TableContainer>
        </Grid>
      ]}
    />
  );
};

export default FirstSquare;
