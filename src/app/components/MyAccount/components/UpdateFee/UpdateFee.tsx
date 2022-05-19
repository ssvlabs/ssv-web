import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router-dom';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import ImageDiv from '~app/common/components/ImageDiv/ImageDiv';
import WhiteWrapper from '~app/common/components/WhiteWrapper/WhiteWrapper';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from '~app/components/MyAccount/components/UpdateFee/UpdateFee.styles';
import DeclareFee from '~app/components/MyAccount/components/UpdateFee/components/DeclareFee';
import FeeUpdated from '~app/components/MyAccount/components/UpdateFee/components/FeeUpdated';
import WaitingPeriod from '~app/components/MyAccount/components/UpdateFee/components/WaitingPeriod';
import PendingExecution from '~app/components/MyAccount/components/UpdateFee/components/PendingExecution';

const UpdateFee = () => {
    const stores = useStores();
    // @ts-ignore
    const { operator_id } = useParams();
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

    // @ts-ignore
    const { logo, address } = operator || {};
    const classes = useStyles({ operatorLogo: logo });

    const copyToClipboard = (key: string) => {
        navigator.clipboard.writeText(key);
        notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

    const openExplorer = (key: string) => {
        window.open(`${config.links.LINK_EXPLORER}/${key}`, '_blank');
    };

    const renderBody = () => {
        switch (0) {
            // @ts-ignore
            case 0:
                return <DeclareFee />;
            // @ts-ignore
            case 1:
                return <WaitingPeriod />;
            // @ts-ignore
            case 2:
                return <PendingExecution />;
            // @ts-ignore
            case 3:
                return <FeeUpdated />;
            default:
            // code block
        }
    };

    if (!operator) return null;

    return (
      <Grid container item>
        <WhiteWrapper header={'Update Operator Fee'}>
          <Grid item container className={classes.HeaderWrapper}>
            <Typography className={classes.Address}>{address}</Typography>
            <ImageDiv onClick={copyToClipboard} image={'copy'} width={24} height={24} />
            <ImageDiv onClick={openExplorer} image={'explorer'} width={24} height={24} />
          </Grid>
        </WhiteWrapper>

        <Grid className={classes.BodyWrapper}>
          {renderBody()}
        </Grid>
      </Grid>
    );
};

export default observer(UpdateFee);