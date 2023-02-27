import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStyles } from './Status.styles';

const Status = ({ item }: { item: any }) => {
    const classes = useStyles();
    const status = item.status.toLowerCase();
    const isActive = status === 'active';
    const noValidators = item.validators_count === 0;
    let classesStatus = classes.Status;
    if (isActive) classesStatus += ` ${classes.Active}`;
    if (noValidators) classesStatus += ` ${classes.NoValidators}`;
    if (!isActive && !noValidators) classesStatus += ` ${classes.Inactive}`;

    return (
      <Grid container item className={classesStatus}>
        <Typography>{noValidators ? 'No Validators' : status}</Typography>
      </Grid>
    );
};

export default Status;
