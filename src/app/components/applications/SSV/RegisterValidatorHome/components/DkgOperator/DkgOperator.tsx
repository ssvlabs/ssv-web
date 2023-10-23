import React from 'react';
import Grid from '@mui/material/Grid';
import { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import {
    useStyles,
} from '~app/components/applications/SSV/RegisterValidatorHome/components/DkgOperator/DkgOperator.styles';

const DkgOperator = ({ operator }: { operator: IOperator }) => {
    const classes = useStyles({ operatorLogo: operator.logo, dkgEnabled: operator.dkg_address });

    return (
        <Grid className={classes.OperatorDetails}>
            <Grid className={classes.OperatorNameAndIdWrapper}>
                <Grid className={classes.OperatorLogo}/>
                <Grid>
                    <Grid className={classes.OperatorName}>{operator.name}</Grid>
                    <Grid className={classes.OperatorId}>ID: {operator.id}</Grid>
                </Grid>
            </Grid>
            <Grid className={classes.DkgEnabledBudge}>DKG Enabled</Grid>
        </Grid>
    );
};

export default DkgOperator;