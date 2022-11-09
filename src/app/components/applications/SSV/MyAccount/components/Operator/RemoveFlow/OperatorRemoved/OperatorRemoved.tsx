import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import WhiteWrapper from '~app/components/common/WhiteWrapper/WhiteWrapper';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import OperatorId from '~app/components/applications/SSV/MyAccount/components/Operator/common/OperatorId/OperatorId';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Operator/RemoveFlow/OperatorRemoved/OperatorRemoved.styles';

const OperatorRemoved = () => {
    const stores = useStores();
    const history = useHistory();
    const classes = useStyles({});
    const operatorStore: OperatorStore = stores.Operator;
    const applicationStore: ApplicationStore = stores.Application;

    const backToMyAccount = async () => {
        applicationStore.setIsLoading(true);
        setTimeout(() => {
            applicationStore.setIsLoading(false);
            history.push(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
        }, 5000);
    };

    return (
      <Grid container item>
        <WhiteWrapper withBackButton={false} header={'Remove Operator'}>
          <OperatorId withoutExplorer id={String(operatorStore.processOperatorId)} />
        </WhiteWrapper>
        <Grid item container className={classes.Wrapper}>
          <Grid item className={classes.BackgroundImage} />
          <Typography className={classes.Header}>Your operator was successfully removed!</Typography>
          <Typography className={classes.SubHeader}>Thank you for your feedback, it is very helpful for us.</Typography>
          <PrimaryButton text={'Back to my Account'} disable={false} submitFunction={backToMyAccount} />
        </Grid>
      </Grid>
    );
};

export default observer(OperatorRemoved);