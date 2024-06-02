import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '~app/atomicComponents';
import config, { translations } from '~app/common/config';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/MyAccount.styles';
import ClusterWarnings from '~app/components/applications/SSV/MyAccount/components/ClusterDashboard/components/ClusterWarnings';
import Dashboard from '~app/components/applications/SSV/MyAccount/components/Dashboard';
import ToggleDashboards from '~app/components/applications/SSV/MyAccount/components/ToggleDashboards';
import LinkText from '~app/components/common/LinkText';
import NaDisplay from '~app/components/common/NaDisplay';
import OperatorCard from '~app/components/common/OperatorCard/OperatorCard';
import OperatorCircleImage from '~app/components/common/OperatorCircleImage';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { useStores } from '~app/hooks/useStores';
import validatorRegistrationFlow from '~app/hooks/useValidatorRegistrationFlow';
import { fetchClusters, getAccountClusters, getClustersPagination, setExcludedCluster, setSelectedClusterId } from '~app/redux/account.slice';
import { getIsDarkMode } from '~app/redux/appState.slice';
import { getAccountAddress } from '~app/redux/wallet.slice';
import { formatNumberToUi } from '~lib/utils/numbers';
import { longStringShorten } from '~lib/utils/strings';
import { getClusterHash } from '~root/services/cluster.service';
import { setClusterSize } from '~app/redux/operator.slice.ts';

const ClusterDashboard = () => {
  const stores = useStores();
  const classes = useStyles({});
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const timeoutRef = useRef(null);
  const clusterIntervalRef = useRef<any>(null);
  const accountAddress = useAppSelector(getAccountAddress);
  const isDarkMode = useAppSelector(getIsDarkMode);
  const accountClusters = useAppSelector(getAccountClusters);
  const processStore: ProcessStore = stores.Process;
  const [hoveredGrid, setHoveredGrid] = useState(null);
  const [loadingCluster, setLoadingClusters] = useState(false);
  const { page, pages, per_page, total } = useAppSelector(getClustersPagination);
  const { getNextNavigation } = validatorRegistrationFlow(location.pathname);

  useEffect(() => {
    dispatch(setExcludedCluster(null));
    clusterIntervalRef.current = setInterval(() => dispatch(fetchClusters({})), 10000);
    return () => {
      if (clusterIntervalRef.current) {
        clearInterval(clusterIntervalRef.current);
      }
    };
  }, []);

  const moveToRegisterValidator = () => {
    navigate(getNextNavigation());
  };

  const handleGridHover = (index: string) => {
    // @ts-ignore
    timeoutRef.current = setTimeout(() => {
      // @ts-ignore
      setHoveredGrid(index);
    }, 300);
  };

  const handleGridLeave = () => {
    // @ts-ignore
    clearTimeout(timeoutRef.current);
    setHoveredGrid(null);
  };

  const createData = (clusterID: string, operators: JSX.Element, validators: number, operational_runway: string | JSX.Element, runWayError: JSX.Element | undefined) => {
    return { clusterID, operators, validators, operational_runway, runWayError };
  };

  const sortedClusters = accountClusters.slice().sort(
    (
      a: {
        runWay: number;
      },
      b: {
        runWay: number;
      }
    ) => a.runWay - b.runWay
  );

  const rows = sortedClusters.map((cluster: any) => {
    const remainingDaysValue = formatNumberToUi(cluster.runWay, true);
    const remainingDays = cluster.runWay && cluster.runWay !== Infinity ? `${remainingDaysValue} Days` : remainingDaysValue;
    return createData(
      longStringShorten(getClusterHash(cluster.operators, accountAddress).slice(2), 4),
      <Grid container style={{ gap: 8 }}>
        {cluster.operators.map((operator: any, index: number) => {
          return (
            <Grid
              item
              container
              key={index}
              onMouseLeave={handleGridLeave}
              className={classes.CircleImageOperatorWrapper}
              onMouseEnter={() => handleGridHover(getClusterHash(cluster.operators, accountAddress) + operator.id)}
            >
              {hoveredGrid === getClusterHash(cluster.operators, accountAddress) + operator.id && <OperatorCard operator={operator} />}
              <OperatorCircleImage operatorLogo={operator.logo} />
            </Grid>
          );
        })}
      </Grid>,
      cluster.validatorCount,
      isNaN(cluster.runWay) ? <NaDisplay text={translations.NA_DISPLAY.TOOLTIP_TEXT} tooltipClassExtend={classes.TooltipCustomSize} /> : remainingDays,
      <ClusterWarnings cluster={cluster} />
    );
  });

  const openSingleCluster = (listIndex: number) => {
    processStore.setProcess(
      {
        processName: 'single_cluster',
        item: sortedClusters[listIndex]
      },
      2
    );
    dispatch(setSelectedClusterId(sortedClusters[listIndex].clusterId));
    dispatch(setClusterSize(sortedClusters[listIndex].operators.length));
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.ROOT);
  };

  const moveToFeeRecipient = () => {
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.FEE_RECIPIENT);
  };

  const onChangePage = async (newPage: number) => {
    setLoadingClusters(true);
    await dispatch(fetchClusters({ forcePage: newPage }));
    setLoadingClusters(false);
  };

  const rowBackgroundColor = (index: number) => {
    const indexCluster = sortedClusters[index];
    if (indexCluster.isLiquidated) return 'rgba(236, 28, 38, 0.03)';
    if (indexCluster.runWay < 30) return isDarkMode ? 'rgba(255, 210, 10, 0.2)' : '#FDFBF0';
  };

  return (
    <Grid container className={classes.MyAccountWrapper}>
      <Grid container item className={classes.HeaderWrapper}>
        <ToggleDashboards title={'Validator Clusters'} />
        <Grid container item xs className={classes.HeaderButtonsWrapper}>
          {rows.length > 0 && <SecondaryButton onClick={moveToFeeRecipient} icon={'/images/test/Group.svg'} text={'Fee Address'} size={ButtonSize.MD} />}
          <PrimaryButton onClick={moveToRegisterValidator} text={'Add Cluster'} size={ButtonSize.MD} />
        </Grid>
      </Grid>
      <Dashboard
        disable
        rows={rows}
        loading={loadingCluster}
        noItemsText={'No Clusters'}
        rowBackgroundColor={rowBackgroundColor}
        paginationActions={{
          page,
          count: total,
          onChangePage,
          totalPages: pages,
          rowsPerPage: per_page
        }}
        rowsAction={openSingleCluster}
        columns={[
          {
            name: 'Cluster ID',
            tooltip: (
              <Grid>
                Clusters represent a unique set of operators who operate your validators. <LinkText text={'Read more on clusters'} link={config.links.MORE_ON_CLUSTERS} />
              </Grid>
            )
          },
          { name: 'Operators' },
          { name: 'Validators' },
          { name: 'Est Operational Runway' },
          { name: '' }
        ]}
      />
    </Grid>
  );
};

export default observer(ClusterDashboard);
