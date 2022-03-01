import React from 'react';
import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { longStringShorten } from '~lib/utils/strings';
import OperatorType from '~app/common/components/OperatorType/OperatorType';
import { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import { useStyles } from './OperatorDetails.styles';

type Props = {
    operator: IOperator
};

const OperatorDetails = (props: Props) => {
    const { operator } = props;
    const classes = useStyles();
    const shaPublicKey = `0x${longStringShorten(sha256(operator.public_key), 4)}`;

    return (
      <Grid container className={classes.Wrapper}>
        <Grid item className={classes.OperatorLogo} style={{ backgroundImage: operator.logo ? `url(${operator.logo})` : '' }} />
        <Grid container item xs>
          <Grid item className={classes.Name}>{operator.name}</Grid>
          <Grid item className={classes.OperatorType}>
            <OperatorType type={operator.type} />
          </Grid>
          <Grid item className={classes.Address} xs={12}>{shaPublicKey}</Grid>
        </Grid>
      </Grid>
    );
};

export default observer(OperatorDetails);
