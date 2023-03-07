import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import { useStyles } from './TextInput.styles';

type InputProps = {
    icon?: any,
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

const TextInput = ({ value, placeHolder, icon, onBlurCallBack, onChangeCallback, withLock, disable, showError, extendClass, wrapperClass, dataTestId, withSideText, sideText, sideIcon }: InputProps) => {
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
        justifyContent={withLock && 'space-between'}
        className={wrapperClass ?? `${classes.Wrapper} ${extendClass}`}>
        {withLock && <Grid item className={`${classes.Lock} ${disable ? classes.LockDisable : ''}`} onClick={() => { !disable && showPassword(!password); }} />}
        <Grid item xs>
          <input
            value={value}
            maxLength={614}
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
                  {sideIcon ?? sideText ?? 'SSV'}
              </Grid>
          )}
          {icon && (
              <Grid item className={classes.Icon}>
                  {icon}
              </Grid>
          )}
      </Grid>
    );
};

export default TextInput;
