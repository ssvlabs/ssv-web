import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import React, { useEffect } from 'react';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/components/common/Status';
import { formatNumberToUi } from '~lib/utils/numbers';
import { Table } from '~app/components/common/Table/Table';
import ToolTip from '~app/components/common/ToolTip/ToolTip';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import MyBalance from '~app/components/applications/SSV/MyAccount/components/MyBalance';
import ProcessStore, { SingleValidatorProcess } from '~app/common/stores/applications/SsvWeb/Process.store';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/Validator/SingleValidator/SingleValidator.styles';
import OperatorDetails
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import OperatorBox
  from '~app/components/applications/SSV/MyAccount/components/Validator/SingleValidator/components/OperatorBox';

const SingleValidator = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const applicationStore: ApplicationStore = stores.Application;
  const process: SingleValidatorProcess = processStore.getProcess;
  const validator = process?.item;
  const validatorPublicKey = validator?.public_key;

  useEffect(() => {
    if (!validator) return navigate(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
    applicationStore.setIsLoading(true);
    myAccountStore.getValidator(validatorPublicKey).then((response: any) => {
      console.log(response);
      if (response) {
        response.total_operators_fee = ssvStore.newGetFeeForYear(response.operators.reduce(
            (previousValue: number, currentValue: IOperator) => previousValue + walletStore.fromWei(currentValue.fee),
            0,
        ));
        processStore.setProcess({
          processName: 'single_validator',
          item: response,
        }, 2);
        applicationStore.setIsLoading(false);
      }
    });
  }, []);

  const data = React.useMemo(
      () => {
        // return validator operators mapped with additional fields fee and performance
        // @ts-ignore
        return validator?.operators?.map((operator: any) => {
          // eslint-disable-next-line no-param-reassign
          operator.performance = (operator.performance['30d'] && Number(operator.performance['30d']).toFixed(2)) || 0;

          const {
            status,
            performance,
          } = operator;

          return {
            public_key: <OperatorDetails operator={operator}/>,
            status: <Status status={status}/>,
            performance: <Typography className={classes.PerformanceHeader}>{performance}%</Typography>,
            fee: <Grid item container style={{ justifyContent: 'space-between' }}>
              <Grid item>
                <SsvAndSubTitle leftTextAlign
                                ssv={formatNumberToUi(ssvStore.newGetFeeForYear(walletStore.fromWei(operator.fee)))}/>
              </Grid>

              {/* <Grid item container xs> */}
              {/*  <Grid item xs={12}> */}
              {/*    <Typography>{operatorStore.getFeePerYear(walletStore.fromWei(operator.fee))} SSV</Typography> */}
              {/*  </Grid> */}
              {/*  <Grid item>~$757.5</Grid> */}
              {/* </Grid> */}
              <Grid item className={classes.ExplorerImage} onClick={() => {
                GoogleTagManager.getInstance().sendEvent({
                  category: 'explorer_link',
                  action: 'click',
                  label: 'operator',
                });
                window.open(`${config.links.EXPLORER_URL}/operators/${operator.id}/?version=${config.links.EXPLORER_VERSION}&network=${config.links.EXPLORER_NETWORK}`);
              }}/>
            </Grid>,
          };
        });
      },
      [validator, applicationStore.darkMode],
  );

  const editValidator = () => {
    navigate(config.routes.SSV.MY_ACCOUNT.VALIDATOR.VALIDATOR_UPDATE.CHOOSE_OPERATORS);
  };

  const columns = React.useMemo(
      () => [
        {
          id: 'col13',
          Header: <Grid container style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>Operators</Typography>
            <SecondaryButton disable={ssvStore.userLiquidated} className={classes.Edit} submitFunction={editValidator}
                             text={'Edit'}/>
          </Grid>,
          columns: [
            {
              Header: 'Operator',
              accessor: 'public_key',
            },
            {
              Header: <Grid container item alignItems={'center'}>
                <Grid item style={{ marginRight: 4 }}>
                  Status
                </Grid>
                <ToolTip
                    text={'Is the operator performing duties for the majority of its validators for the last 2 epochs.'}/>
              </Grid>,
              accessor: 'status',
            },
            {
              Header: '30D Performance',
              accessor: 'performance',
            },
            {
              Header: 'Yearly Fee',
              accessor: 'fee',
            },
          ],
        },
      ], [applicationStore.darkMode],
  );

  return (
      <Grid container className={classes.SingleValidatorWrapper}>
        <NewWhiteWrapper
            type={0}
            header={'Cluster'}
        />
        <Grid container item className={classes.Section}>
          {(validator?.operators ?? [null, null, null, null]).map((operator: any, index: number) => {
            return <OperatorBox key={index} operator={operator}/>;
          })}
        </Grid>
        <Grid container item className={classes.Section}>
          <Grid item>
            <MyBalance />
          </Grid>
          <Grid item xs>
            {validator.operators && <Table columns={columns} data={data} hideActions/>}
          </Grid>
        </Grid>
      </Grid>
  );
};

export default observer(SingleValidator);
