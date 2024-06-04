import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import config from '~app/common/config';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/ValidatorList/ValidatorList.styles';

const ValidatorCounter = ({
  changeCountOfValidators,
  countOfValidators,
  maxCount,
  unselectLastValidator,
  selectLastValidValidator
}: {
  countOfValidators: number;
  maxCount: number;
  unselectLastValidator: Function;
  changeCountOfValidators: (e: any) => void;
  selectLastValidValidator: Function;
}) => {
  const [reachedMinCount, setReachedMinCount] = useState(false);
  const [reachedMaxCount, setReachedMaxCount] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const classes = useStyles({ reachedMinCount, reachedMaxCount });

  const handleFocus = () => {
    setIsTyping(false);
  };

  const handleChange = (e: any) => {
    if (!isTyping) {
      changeCountOfValidators(Number(e.target.value.slice(-1)));
      setIsTyping(true);
    } else {
      changeCountOfValidators(Number(e.target.value));
    }
  };

  useEffect(() => {
    setReachedMaxCount(countOfValidators === maxCount);
    setReachedMinCount(
      countOfValidators ===
        config.GLOBAL_VARIABLE.MIN_VALIDATORS_COUNT_PER_BULK_REGISTRATION
    );
  }, [countOfValidators]);

  const increaseCount = () => {
    if (countOfValidators < maxCount) {
      selectLastValidValidator();
    }
  };
  const decreaseCount = () => {
    if (
      countOfValidators >
      config.GLOBAL_VARIABLE.MIN_VALIDATORS_COUNT_PER_BULK_REGISTRATION
    ) {
      unselectLastValidator();
    }
  };

  return (
    <Grid className={classes.ValidatorCounterWrapper}>
      <Grid
        onClick={decreaseCount}
        className={`${classes.CounterButton} ${reachedMinCount && classes.DisabledButton}`}
      >
        <Grid
          className={`${classes.MinusIcon} ${reachedMinCount && classes.DisabledMinus}`}
        />
      </Grid>
      <Grid className={classes.CounterWrapper}>
        {maxCount ? (
          <input
            onChange={handleChange}
            onFocus={handleFocus}
            className={classes.InnerInput}
            value={countOfValidators}
          />
        ) : (
          '-'
        )}
      </Grid>
      <Grid
        onClick={increaseCount}
        className={`${classes.CounterButton} ${reachedMaxCount && classes.DisabledButton}`}
      >
        <Grid
          className={`${classes.PlusIcon} ${reachedMaxCount && classes.DisabledPlus}`}
        />
      </Grid>
    </Grid>
  );
};

export default ValidatorCounter;
