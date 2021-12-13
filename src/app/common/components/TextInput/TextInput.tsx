import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from './TextInput.styles';

type InputProps = {
    value?: any,
    onBlur?: any,
    onChange?: any,
    disable?: boolean,
    withLock?: boolean,
    showError?: boolean,
    dataTestId?: string,
    withSideText?: boolean,
};

const TextInput = ({ value, onBlur, onChange, withLock, disable, showError, dataTestId, withSideText }: InputProps) => {
    const classes = useStyles();
    const [password, showPassword] = useState(true);
    useEffect(() => {
        if (disable && password) {
            showPassword(false);
        }
    }, [disable]);
    return (
      <Grid container
        className={`${classes.Wrapper} ${disable ? classes.disable : ''} ${showError ? classes.Error : ''}`}>
        {withLock && <Grid item className={`${classes.Lock} ${disable ? classes.LockDisable : ''}`} onClick={() => { !disable && showPassword(!password); }} />}
        <Grid item className={classes.InputWrapper}>
          <input
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            disabled={disable}
            data-testid={dataTestId}
            className={classes.Input}
            type={(!withLock || password) ? 'text' : 'password'}
          />
        </Grid>
        {withSideText && (
        <Grid item className={classes.Text}>
          SSV
        </Grid>
        )}
      </Grid>
    );
};

export default TextInput;
