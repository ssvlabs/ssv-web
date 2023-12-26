import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/OperatorId/OperatorId.styles';

type Props = {
  id: number,
  text?: string,
  successPage?: boolean,
  withoutExplorer?: boolean,
};

const OperatorId = (props: Props) => {
  const stores = useStores();
  const { id, text, successPage, withoutExplorer } = props;
  const classes = useStyles({ successPage });
  const notificationsStore: NotificationsStore = stores.Notifications;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(String(props.id));
    notificationsStore.showMessage('Copied to clipboard.', 'success');
  };

  const openExplorer = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: 'operator',
    });
    window.open(`${config.links.EXPLORER_URL}/operators/${id}`, '_blank');
  };

  return (
    <Grid item container className={classes.Wrapper}>
      <Typography className={classes.OperatorId}>{text ?? successPage ? 'ID' : 'Operator ID'}: {id}</Typography>
      <ImageDiv onClick={copyToClipboard} image={'copy'} width={24} height={24} />
      {!withoutExplorer && <ImageDiv onClick={openExplorer} image={'explorer'} width={24} height={24} />}
    </Grid>
  );
};

export default observer(OperatorId);
