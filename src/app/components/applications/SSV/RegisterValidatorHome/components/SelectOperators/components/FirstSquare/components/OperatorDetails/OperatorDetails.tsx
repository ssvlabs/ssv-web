import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { longStringShorten } from '~lib/utils/strings';
import OperatorType from '~app/components/common/OperatorType/OperatorType';
// import { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import { useStyles } from './OperatorDetails.styles';

type Props = {
    gray80?: boolean;
    operator: any // ?? IOperator
};

const OperatorDetails = (props: Props) => {
    const { gray80, operator } = props;
    const classes = useStyles({ operatorLogo: operator.logo, gray80 });
    const shaPublicKey = `0x${longStringShorten(operator.address, 4)}`;

    return (
      <Grid container className={classes.Wrapper}>
        <Grid item className={classes.OperatorLogo} />
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
