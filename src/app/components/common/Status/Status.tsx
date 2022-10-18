import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './Status.styles';

const Status = ({ status }: { status: string }) => {
    const classes = useStyles();
    const isActive = status?.toLowerCase() === 'active';
    const noValidators = status === 'No validators';
    let classesStatus = classes.Status;
    if (isActive) classesStatus += ` ${classes.Active}`;
    if (noValidators) classesStatus += ` ${classes.NoValidators}`;
    if (!isActive && !noValidators) classesStatus += ` ${classes.Inactive}`;

    return (
      <Grid container item className={classesStatus}>
        <Typography>{status}</Typography>
      </Grid>
    );
};

export default Status;
