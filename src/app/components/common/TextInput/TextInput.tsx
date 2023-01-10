import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from './TextInput.styles';

type InputProps = {
    value?: any,
    sideIcon?: any,
    disable?: boolean,
    sideText?: string,
    withLock?: boolean,
    showError?: boolean,
    dataTestId?: string,
    placeHolder?: string,
    onBlurCallBack?: any,
    extendClass?: string,
    wrapperClass?: string,
    withSideText?: boolean,
    onChangeCallback?: any,
};

const TextInput = ({ value, placeHolder, onBlurCallBack, onChangeCallback, withLock, disable, showError, extendClass, wrapperClass, dataTestId, withSideText, sideText, sideIcon }: InputProps) => {
    const classes = useStyles({ showError, disable });
    const [password, showPassword] = useState(false);

    const onChangeWrapper = (e: any) => {
        const inputValue = e.target.value;
        if (inputValue.length >= 614) return;
        onChangeCallback(e);
    };

    return (
      <Grid container
          // @ts-ignore
        justify={withLock && 'space-between'}
        className={wrapperClass ?? `${classes.Wrapper} ${extendClass}`}>
        {withLock && <Grid item className={`${classes.Lock} ${disable ? classes.LockDisable : ''}`} onClick={() => { !disable && showPassword(!password); }} />}
        <Grid item xs>
          <input
            value={value}
            maxLength={614}
            disabled={disable}
            onBlur={onBlurCallBack}
            data-testid={dataTestId}
            onChange={onChangeWrapper}
            placeholder={placeHolder ?? ''}
            className={classes.Input}
            type={(!withLock || password) ? 'text' : 'password'}
          />
        </Grid>
        {withSideText && (
        <Grid item className={classes.Text}>
            {sideIcon ?? sideText ?? 'SSV'}
        </Grid>
        )}
      </Grid>
    );
};

export default TextInput;
