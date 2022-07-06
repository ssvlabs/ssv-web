import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useStores } from '~app/hooks/useStores';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from './OperatorId.styles';
import config from '~app/common/config';

type Props = {
    id: string,
    text?: string,
    successPage?: boolean,
};

const OperatorId = (props: Props) => {
    const stores = useStores();
    const { id, text, successPage } = props;
    const classes = useStyles({ successPage });
    const notificationsStore: NotificationsStore = stores.Notifications;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(props.id);
        notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

    const openExplorer = () => {
        window.open(`${config.links.LINK_EXPLORER}/operators/${id}`, '_blank');
    };

    return (
      <Grid item container className={classes.Wrapper}>
        <Typography className={classes.OperatorId}>{text ?? successPage ? 'ID' : 'Operator ID'}: {id}</Typography>
        <ImageDiv onClick={copyToClipboard} image={'copy'} width={24} height={24} />
        <ImageDiv onClick={openExplorer} image={'explorer'} width={24} height={24} />
      </Grid>
    );
};

export default observer(OperatorId);