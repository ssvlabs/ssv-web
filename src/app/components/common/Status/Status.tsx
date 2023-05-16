import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStyles } from './Status.styles';

const Status = ({ item }: { item: any }) => {
    const classes = useStyles();
    const isDeleted = item.is_deleted;
    const status = item.status.toLowerCase();
    const inValid = item.is_valid === false;
    const isActive = status === 'active';
    const noValidators = item.validators_count === 0;


    const statusRender = () => {
        if (isDeleted) return 'Removed';
        if (noValidators) return 'No Validators';
        if (isActive) return 'Active';
        if (inValid) return 'Invalid';
        return 'Inactive';
    };

    const classRender = () => {
        let classesStatus = classes.Status;
        if (isDeleted) return `${classesStatus} ${classes.IsDeleted}`;
        if (noValidators) return `${classesStatus} ${classes.NoValidators}`;
        if (isActive) return `${classesStatus} ${classes.Active}`;
        if (inValid) return `${classesStatus} ${classes.Inactive}`;
        if (!isActive) return `${classesStatus} ${classes.Inactive}`;
        return classesStatus;
    };

    return (
      <Grid container item className={classRender()}>
        <Typography>{statusRender()}</Typography>
      </Grid>
    );
};

export default Status;
