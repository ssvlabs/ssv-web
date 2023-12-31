import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import {
  useStyles,
} from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/ValidatorList/ValidatorList.styles';

const ValidatorCounter = ({ countOfValidators, maxCount, unselectLastValidator, selectLastValidValidator }: {
  countOfValidators: number,
  maxCount: number,
  unselectLastValidator: Function,
  selectLastValidValidator: Function
}) => {
  const [reachedMinCount, setReachedMinCount] = useState(false);
  const [reachedMaxCount, setReachedMaxCount] = useState(false);
  const classes = useStyles({ reachedMinCount, reachedMaxCount });

  useEffect(() => {
    setReachedMaxCount(countOfValidators === maxCount);
    setReachedMinCount(countOfValidators === 0);
  }, [countOfValidators]);

  const increaseCount = () => {
    if (countOfValidators < maxCount) {
      selectLastValidValidator();
    }
  };
  const decreaseCount = () => {
    if (countOfValidators > 0) {
      unselectLastValidator();
    }
  };

  return (
    <Grid className={classes.ValidatorCounterWrapper}>
      <Grid onClick={decreaseCount} className={`${classes.CounterButton} ${reachedMinCount && classes.DisabledButton}`}><Grid
        className={`${classes.MinusIcon} ${reachedMinCount && classes.DisabledMinus}`}/></Grid>
      <Grid className={classes.CounterWrapper}>{maxCount ? countOfValidators : '-'}</Grid>
      <Grid onClick={increaseCount} className={`${classes.CounterButton} ${reachedMaxCount && classes.DisabledButton}`}><Grid
        className={`${classes.PlusIcon} ${reachedMaxCount && classes.DisabledPlus}`}/></Grid>
    </Grid>
  );
};

export default ValidatorCounter;