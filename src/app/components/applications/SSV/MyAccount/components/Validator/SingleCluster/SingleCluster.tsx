import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/components/common/Status';
import ImageDiv from '~app/components/common/ImageDiv';
import { longStringShorten } from '~lib/utils/strings';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import Balance from '~app/components/applications/SSV/MyAccount/components/Balance';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import Dashboard from '~app/components/applications/SSV/NewMyAccount/components/Dashboard/Dashboard';
import ProcessStore, { SingleClusterProcess } from '~app/common/stores/applications/SsvWeb/Process.store';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/SingleCluster.styles';
import OperatorBox
  from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/OperatorBox';

const SingleCluster = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const processStore: ProcessStore = stores.Process;
  const process: SingleClusterProcess = processStore.getProcess;
  const cluster = process?.item;

  useEffect(() => {
    if (!cluster) return navigate(config.routes.SSV.MY_ACCOUNT.DASHBOARD);

  }, []);

  // const data = React.useMemo(
  //     () => {
  //       // return validator operators mapped with additional fields fee and performance
  //       // @ts-ignore
  //       return cluster?.operators?.map((operator: any) => {
  //         console.log(operator);
  //         // eslint-disable-next-line no-param-reassign
  //         operator.performance = (operator.performance['30d'] && Number(operator.performance['30d']).toFixed(2)) || 0;
  //
  //         const { performance } = operator;
  //
  //         return {
  //           public_key: <OperatorDetails operator={operator}/>,
  //           status: <Status item={operator} />,
  //           performance: <Typography className={classes.PerformanceHeader}>{performance}%</Typography>,
  //           fee: <Grid item container style={{ justifyContent: 'space-between' }}>
  //             <Grid item>
  //               <SsvAndSubTitle leftTextAlign
  //                               ssv={formatNumberToUi(ssvStore.newGetFeeForYear(walletStore.fromWei(operator.fee)))}/>
  //             </Grid>
  //
  //             {/* <Grid item container xs> */}
  //             {/*  <Grid item xs={12}> */}
  //             {/*    <Typography>{operatorStore.getFeePerYear(walletStore.fromWei(operator.fee))} SSV</Typography> */}
  //             {/*  </Grid> */}
  //             {/*  <Grid item>~$757.5</Grid> */}
  //             {/* </Grid> */}
  //             <Grid item className={classes.ExplorerImage} onClick={() => {
  //               GoogleTagManager.getInstance().sendEvent({
  //                 category: 'explorer_link',
  //                 action: 'click',
  //                 label: 'operator',
  //               });
  //               window.open(`${config.links.EXPLORER_URL}/operators/${operator.id}/?version=${config.links.EXPLORER_VERSION}&network=${config.links.EXPLORER_NETWORK}`);
  //             }}/>
  //           </Grid>,
  //         };
  //       });
  //     },
  //     [cluster, applicationStore.darkMode],
  // );

  // const editValidator = () => {
  //   navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.VALIDATOR_UPDATE.CHOOSE_OPERATORS);
  // };

  // const columns = React.useMemo(
  //     () => [
  //       {
  //         id: 'col13',
  //         Header: <Grid container style={{ justifyContent: 'space-between', alignItems: 'center' }}>
  //           <Typography>Operators</Typography>
  //           <SecondaryButton disable={ssvStore.userLiquidated} className={classes.Edit} submitFunction={editValidator}
  //                            text={'Edit'}/>
  //         </Grid>,
  //         columns: [
  //           {
  //             Header: 'Operator',
  //             accessor: 'public_key',
  //           },
  //           {
  //             Header: <Grid container item alignItems={'center'}>
  //               <Grid item style={{ marginRight: 4 }}>
  //                 Status
  //               </Grid>
  //               <ToolTip
  //                   text={'Is the operator performing duties for the majority of its validators for the last 2 epochs.'}/>
  //             </Grid>,
  //             accessor: 'status',
  //           },
  //           {
  //             Header: '30D Performance',
  //             accessor: 'performance',
  //           },
  //           {
  //             Header: 'Yearly Fee',
  //             accessor: 'fee',
  //           },
  //         ],
  //       },
  //     ], [applicationStore.darkMode],
  // );
  const createData = (
      publicKey: string,
      status: JSX.Element,
      balance: JSX.Element,
      apr: JSX.Element,
  ) => {
    return { publicKey, status, balance, apr };
  };

  const rows = [0]?.map(()=>{
    return createData(
        longStringShorten('0xjashdjashduiqh3keuh1eh1kj23h1u23h12', 4),
        <Status item={{ status: 'active' }} />,
        <Grid item>33.12</Grid>,
        <Grid item>6%</Grid>,
    );
  });

  const addToCluster = () => {
    process.processName = 'cluster_registration';
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.ADD_VALIDATOR);
  };

  return (
      <Grid container>
        <NewWhiteWrapper
            type={0}
            header={'Cluster'}
        />
        <Grid container item className={classes.Section}>
          {(cluster?.operators).map((operator: any, index: number) => {
            return <OperatorBox key={index} operator={operator} />;
          })}
        </Grid>
        <Grid container item className={classes.Section}>
          <Grid item>
            <Balance />
          </Grid>
          <Grid item xs>
            {cluster.operators && <Dashboard
                disable
                rows={rows}
                header={<Grid container className={classes.HeaderWrapper}>
                  <Grid item className={classes.Header}>Validators</Grid>
                  <SecondaryButton className={classes.AddToCluster} text={'+ Add Validator'}
                                   submitFunction={addToCluster} />
                </Grid>}
                paginationActions={{
                  page: 1,
                  count: 10,
                  onChangePage: console.log,
                  totalPages: 1,
                  rowsPerPage: 5,
                }}
                rowsAction={console.log}
                columns={[
                  { name: 'Public Key' },
                  { name: 'Status' },
                  { name: 'Balance' },
                  { name: 'Est. APR' },
                ]}
                extraActions={<Grid container className={classes.ExtraButtonsWrapper}>
                  <ImageDiv onClick={console.log} image={'beacon'} width={24} height={24} />
                  <ImageDiv onClick={console.log} image={'explorer'} width={24} height={24} />
                  <ImageDiv onClick={console.log} image={'setting'} width={24} height={24} />
                </Grid>}
            />}
          </Grid>
        </Grid>
      </Grid>
  );
};

export default observer(SingleCluster);
