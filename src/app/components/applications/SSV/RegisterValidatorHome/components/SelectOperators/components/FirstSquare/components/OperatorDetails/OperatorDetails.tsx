import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStores } from '~app/hooks/useStores';
import OperatorType from '~app/components/common/OperatorType/OperatorType';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from './OperatorDetails.styles';

type Props = {
    gray80?: boolean;
    withCopy?: boolean;
    operator: any // ?? IOperator
};

const OperatorDetails = (props: Props) => {
    const { gray80, operator, withCopy } = props;
    const stores = useStores();
    const notificationsStore: NotificationsStore = stores.Notifications;
    const classes = useStyles({ operatorLogo: operator.logo, gray80 });
    let operatorName = operator?.name;
    if (operator?.name?.length > 14) operatorName = `${operator.name.slice(0, 13)}...`;

    const copyId = () => {
        navigator.clipboard.writeText(operator?.id);
        notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

    return (
      <Grid container className={classes.Wrapper}>
        <Grid item className={classes.OperatorLogo} />
        <Grid item className={classes.TextWrapper}>
          <Grid item className={classes.Name}>{operatorName ?? 'Unknown'}</Grid>
          <Grid item container className={classes.Id}>
            ID: {operator.id}
            {withCopy && <Grid className={classes.Copy} onClick={copyId} />}
          </Grid>
        </Grid>
        {operator.type !== 'operator' && (
          <Grid item className={classes.OperatorType}>
            <OperatorType type={operator.type} />
          </Grid>
        )}
      </Grid>
    );
};

export default observer(OperatorDetails);
