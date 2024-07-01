import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStyles } from './Status.styles';
import { useMemo } from 'react';
import { IOperator } from '~app/model/operator.model.ts';
import { IValidator } from '~app/model/validator.model.ts';

const Status = ({ item }: { item: IOperator | IValidator }) => {
  const classes = useStyles();
  const isDeleted = item.is_deleted;
  const status = item.status.toLowerCase();
  const inValid = !item.is_valid;
  const isActive = status === 'active';
  const noValidators = 'validators_count' in item && item.validators_count === 0;

  const { statusLabel, statusClasses } = useMemo(() => {
    const classesStatus = classes.Status;
    if (isDeleted) return { statusLabel: 'Removed', statusClasses: `${classesStatus} ${classes.IsDeleted}` };
    if (inValid) return { statusLabel: 'Invalid', statusClasses: `${classesStatus} ${classes.Invalid}` };
    if (noValidators) return { statusLabel: 'No Validators', statusClasses: `${classesStatus} ${classes.NoValidators}` };
    if (isActive) return { statusLabel: 'Active', statusClasses: `${classesStatus} ${classes.Active}` };
    return { statusLabel: 'Inactive', statusClasses: `${classesStatus} ${classes.Inactive}` };
  }, [classes.Active, classes.Inactive, classes.Invalid, classes.IsDeleted, classes.NoValidators, classes.Status, inValid, isActive, isDeleted, noValidators]);

  return (
    <Grid container item className={statusClasses}>
      <Typography>{statusLabel}</Typography>
    </Grid>
  );
};

export default Status;
