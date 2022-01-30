import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from './TextInput.styles';

type InputProps = {
    value?: any,
    onBlur?: any,
    onChange?: any,
    sideIcon?: any,
    disable?: boolean,
    withLock?: boolean,
    showError?: boolean,
    dataTestId?: string,
    placeHolder?: string,
    withSideText?: boolean,
};

const TextInput = ({ value, placeHolder, onBlur, onChange, withLock, disable, showError, dataTestId, withSideText, sideIcon }: InputProps) => {
    const classes = useStyles();
    const [password, showPassword] = useState(false);

    return (
      <Grid container
          // @ts-ignore
        justify={withLock && 'space-between'}
        className={`${classes.Wrapper} ${disable ? classes.disable : ''} ${showError ? classes.Error : ''}`}>
        {withLock && <Grid item className={`${classes.Lock} ${disable ? classes.LockDisable : ''}`} onClick={() => { !disable && showPassword(!password); }} />}
        <Grid item xs>
          <input
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={placeHolder ?? ''}
            disabled={disable}
            data-testid={dataTestId}
            className={classes.Input}
            type={(!withLock || password) ? 'text' : 'password'}
          />
        </Grid>
        {withSideText && (
        <Grid item className={classes.Text}>
            {sideIcon ?? 'SSV'}
        </Grid>
        )}
      </Grid>
    );
};

export default TextInput;
