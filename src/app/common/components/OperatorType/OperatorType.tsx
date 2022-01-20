import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from '~app/common/components/OperatorType/OperatorType.styles';

type Props = {
    type: string | undefined,
};

const OperatorType = (props: Props) => {
    const classes = useStyles();
    const isVerified = props.type === 'verified_operator';
    const isDappNode = props.type === 'dapp_node';

    return (
      <Grid item className={`${classes.OperatorType} ${isVerified ? classes.Verified : ''} ${isDappNode ? classes.DappNode : ''}`} />
    );
};

export default observer(OperatorType);
