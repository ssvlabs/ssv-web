import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStores } from '~app/hooks/useStores';
import OperatorType from '~app/components/common/OperatorType/OperatorType';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from './OperatorDetails.styles';
import ImageDiv from '~app/components/common/ImageDiv/ImageDiv';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import config from '~app/common/config';

type Props = {
  gray80?: boolean;
  withCopy?: boolean;
  withoutExplorer?: boolean;
  operator: any // ?? IOperator
};

const OperatorDetails = (props: Props) => {
    const { gray80, operator, withCopy, withoutExplorer } = props;
    const stores = useStores();
    const notificationsStore: NotificationsStore = stores.Notifications;
    const classes = useStyles({ operatorLogo: operator.logo, gray80 });
    let operatorName = operator?.name;
    if (operator?.name?.length > 14) operatorName = `${operator.name.slice(0, 13)}...`;

    const copyId = () => {
        navigator.clipboard.writeText(operator?.id);
        notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

  const openExplorer = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: 'operator',
    });
    window.open(`${config.links.EXPLORER_URL}/operators/${operator.id}/?version=${config.links.EXPLORER_VERSION}&network=${config.links.EXPLORER_NETWORK}`, '_blank');
  };

    return (
      <Grid container className={classes.Wrapper}>
        <Grid item className={classes.OperatorLogo} />
        <Grid item className={classes.TextWrapper}>
          <Grid item className={classes.Name}>{operatorName ?? `Operator ${operator.id}`}</Grid>
          <Grid item container className={classes.Id}>
            ID: {operator.id}
            {withCopy && <Grid className={classes.Copy} onClick={copyId}/>}
          </Grid>
        </Grid>
        {operator.type !== 'operator' && (
            <Grid item className={classes.OperatorType}>
              <OperatorType type={operator.type}/>
            </Grid>
        )}
        {!withoutExplorer && <Grid item className={classes.OperatorType}>
          <ImageDiv onClick={openExplorer} image={'explorer'} width={20} height={20}/>
        </Grid>}
      </Grid>
    );
};

export default observer(OperatorDetails);
