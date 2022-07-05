import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
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
    let operatorName = operator?.name;
    if (operator.name.length > 14) operatorName = `${operator.name.slice(0, 13)}...`;

    return (
      <Grid container className={classes.Wrapper}>
        <Grid item className={classes.OperatorLogo} />
        <Grid item className={classes.TextWrapper}>
          <Grid item className={classes.Name}>{operatorName}</Grid>
          <Grid item className={classes.Id}>ID: {operator.id}</Grid>
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
