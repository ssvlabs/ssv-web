import React from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/components/common/Status';
import { useStyles } from '../../NewMyAccount.styles';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import Dashboard from '~app/components/applications/SSV/NewMyAccount/components/Dashboard/Dashboard';
import OperatorId from '~app/components/applications/SSV/MyAccount/components/Operator/common/OperatorId/OperatorId';
import OperatorDetails
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';

const OperatorDashboard = ({ changeState }: { changeState: any }) => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const myAccountStore: MyAccountStore = stores.MyAccount;

  const moveToRegisterOperator = () => {
    navigate(config.routes.SSV.OPERATOR.HOME);
  };

  // return validator operators mapped with additional fields fee and performance
  const operatorsData = myAccountStore?.ownerAddressOperators?.map((operator: any) => {
    const { id, name, status, validators_count } = operator;

    return (
        <Grid container item>
          <OperatorDetails operator={operator}/>
          <Status status={status}/>,
        </Grid>
    );

    return {
      public_key: <Grid container item>
        <Grid item xs={12}>{name}</Grid>
        <OperatorId withoutExplorer text={'ID: '} id={id} />
      </Grid>,
      status: <Status status={status} />,
      validators_count: <Grid item>{validators_count}</Grid>,
      extra_buttons: <Grid container item style={{ gap: 7 }} justify={'flex-end'}>
        <Grid onClick={() => {
          GoogleTagManager.getInstance().sendEvent({
            category: 'explorer_link',
            action: 'click',
            label: 'operator',
          });
          window.open(`${config.links.LINK_EXPLORER}/operators/${id}`);
        }} />
        <Grid onClick={() => {
          console.log('here');
          // openSingleOperator(id);
        }} />
      </Grid>,
    };
  });

  return (
      <Grid container className={classes.MyAccountWrapper}>
        <Grid container item className={classes.HeaderWrapper}>
          <Grid container item xs style={{ cursor: 'pointer' }}>
            <Typography className={classes.Header} onClick={() => changeState(1)}>Operator</Typography>
            <Grid className={classes.Arrow}/>
          </Grid>
          <Grid container item xs className={classes.HeaderButtonsWrapper}>
            <Grid item className={classes.HeaderButton} onClick={moveToRegisterOperator}>Add Operator</Grid>
          </Grid>
        </Grid>
        <Dashboard
            body={operatorsData}
            headers={[
              { name: 'Operator Name' },
              { name: 'Status', tooltip: 'Performance' },
              { name: 'Performance' },
              { name: 'Balance' },
              { name: 'Yearly Fee' },
              { name: 'Validators' },
            ]}
      />
    </Grid>
  );
};

export default observer(OperatorDashboard);
