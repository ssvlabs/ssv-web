import React from 'react';
import Grid from '@mui/material/Grid';
import OperatorType from '~app/components/common/OperatorType/OperatorType';
import { useStyles } from '~app/components/applications/SSV/MyAccount/MyAccount.styles';

type OperatorCardProps = {
    operator: any;
    classExtend?: string | false;
};

const OperatorCard = ({ operator, classExtend }: OperatorCardProps) => {
    const classes = useStyles({ operatorLogo: operator.logo });

    return (
        <Grid container className={`${classes.OperatorPopUp} ${classExtend && classExtend}`}>
            <Grid item className={classes.FullImageOperator} />
            <Grid item className={classes.Line} />
            <Grid item>
                <Grid item container style={{ alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                    <Grid>{operator.name}</Grid>
                    {operator.type !== 'operator' && (
                        <OperatorType type={'verified_operator'} />
                    )}
                </Grid>
                <Grid item className={classes.OperatorId}>ID: {operator.id}</Grid>
            </Grid>
        </Grid>
    );
};

export default OperatorCard;