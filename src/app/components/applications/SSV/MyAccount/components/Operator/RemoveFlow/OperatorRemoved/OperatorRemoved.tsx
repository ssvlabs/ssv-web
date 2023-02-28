import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Operator/RemoveFlow/OperatorRemoved/OperatorRemoved.styles';

const OperatorRemoved = () => {
    const stores = useStores();
    const navigate = useNavigate();
    const classes = useStyles({});
    const applicationStore: ApplicationStore = stores.Application;

    const backToMyAccount = async () => {
        applicationStore.setIsLoading(true);
        setTimeout(() => {
            applicationStore.setIsLoading(false);
            navigate(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
        }, 5000);
    };

    return (
      <Grid container item>
        <NewWhiteWrapper type={1} header={'Operator Details'} />
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