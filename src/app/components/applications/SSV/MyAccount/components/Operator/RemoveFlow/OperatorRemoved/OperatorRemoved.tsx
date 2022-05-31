import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { useHistory, useParams } from 'react-router-dom';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import WhiteWrapper from '~app/components/common/WhiteWrapper/WhiteWrapper';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Operator/RemoveFlow/OperatorRemoved/OperatorRemoved.styles';

const OperatorRemoved = () => {
    const stores = useStores();
    const history = useHistory();
    // @ts-ignore
    const { operator_id } = useParams();
    const classes = useStyles({});
    const [operator, setOperator] = useState(null);
    const applicationStore: ApplicationStore = stores.Application;
    const notificationsStore: NotificationsStore = stores.Notifications;

    useEffect(() => {
        applicationStore.setIsLoading(true);
        Operator.getInstance().getOperator(operator_id).then((response: any) => {
            if (response) {
                setOperator(response);
                applicationStore.setIsLoading(false);
            }
        });
    }, []);

    const backToMyAccount = async () => {
        history.push(config.routes.MY_ACCOUNT.DASHBOARD);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address);
        notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

    // @ts-ignore
    const { address } = operator || {};

    if (!operator) return null;

    return (
      <Grid container item>
        <WhiteWrapper withBackButton={false} header={'Remove Operator'}>
          <Grid item container className={classes.HeaderWrapper}>
            <Typography className={classes.Address}>{address}</Typography>
            <ImageDiv onClick={copyToClipboard} image={'copy'} width={24} height={24} />
            <ImageDiv image={'explorer'} width={24} height={24} />
          </Grid>
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