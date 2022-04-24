import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from './TextInput.styles';

type InputProps = {
    value?: any,
    sideIcon?: any,
    disable?: boolean,
    withLock?: boolean,
    showError?: boolean,
    dataTestId?: string,
    placeHolder?: string,
    onBlurCallBack?: any,
    withSideText?: boolean,
    onChangeCallback?: any,
};

const TextInput = ({ value, placeHolder, onBlurCallBack, onChangeCallback, withLock, disable, showError, dataTestId, withSideText, sideIcon }: InputProps) => {
    const classes = useStyles({ showError, disable });
    const [password, showPassword] = useState(false);

    const onChangeWrapper = (e: any) => {
        const inputValue = e.target.value;
        if (inputValue.length >= 100) return;
        onChangeCallback(e);
    };

    return (
      <Grid container
          // @ts-ignore
        justify={withLock && 'space-between'}
        className={classes.Wrapper}>
        {withLock && <Grid item className={`${classes.Lock} ${disable ? classes.LockDisable : ''}`} onClick={() => { !disable && showPassword(!password); }} />}
        <Grid item xs>
          <input
            value={value}
            maxLength={100}
            disabled={disable}
            onBlur={onBlurCallBack}
            data-testid={dataTestId}
            className={classes.Input}
            onChange={onChangeWrapper}
            placeholder={placeHolder ?? ''}
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
