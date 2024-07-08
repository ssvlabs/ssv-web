import Grid from '@mui/material/Grid';
import { ChangeEvent, ComponentPropsWithRef, useState } from 'react';
import { useStyles } from './TextInput.styles';
import { InputSideButton } from '~app/atomicComponents';
import styled from 'styled-components';

type InputProps = {
  type?: ComponentPropsWithRef<'input'>['type'];
  icon?: any;
  value?: any;
  sideIcon?: any;
  disable?: boolean;
  sideText?: string;
  withLock?: boolean;
  showError?: boolean;
  dataTestId?: string;
  placeHolder?: string;
  onBlurCallBack?: any;
  extendClass?: string;
  wrapperClass?: string;
  withSideText?: boolean;
  onFocusCallback?: any;
  onPasteCallback?: any;
  onChangeCallback?: any;
  extendInputClass?: string;
  isTextArea?: boolean;
  sideButton?: boolean;
  isShowSsvLogo?: boolean;
  sideButtonClicked?: boolean;
  sideButtonLabel?: string;
  sideButtonAction?: Function;
  sideButtonDisabled?: boolean;
};

const SsvLogo = styled.div`
  width: 14px;
  height: 20px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(/images/ssvIcons/logo.svg);
`;

const TextInput = ({
  type,
  icon,
  value,
  disable,
  sideIcon,
  sideText,
  withLock,
  showError,
  dataTestId,
  extendClass,
  placeHolder,
  wrapperClass,
  withSideText,
  onFocusCallback,
  onBlurCallBack,
  onChangeCallback,
  onPasteCallback,
  extendInputClass,
  sideButtonAction,
  sideButtonLabel,
  sideButtonClicked,
  sideButton,
  isTextArea,
  isShowSsvLogo,
  sideButtonDisabled,
  ...params
}: InputProps) => {
  const classes = useStyles({ showError, disable, isTextArea });
  const [password, showPassword] = useState(false);
  const onChangeWrapper = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length >= 614) return;
    onChangeCallback(e);
    // @ts-ignore
    if (params?.inputProps?.onChange) params.inputProps?.onChange(e);
  };

  return (
    <Grid
      container
      // @ts-ignore
      justifyContent={withLock && 'space-between'}
      className={wrapperClass ?? `${classes.Wrapper} ${extendClass}`}
    >
      {withLock && (
        <Grid
          item
          className={`${classes.Lock} ${disable ? classes.LockDisable : ''}`}
          onClick={() => {
            !disable && showPassword(!password);
          }}
        />
      )}
      <Grid item xs>
        {isTextArea ? (
          <textarea
            rows={2}
            value={value}
            maxLength={614}
            disabled={disable}
            onBlur={onBlurCallBack}
            data-testid={dataTestId}
            className={`${classes.Input} ${extendInputClass}`}
            onChange={onChangeWrapper}
            placeholder={placeHolder ?? ''}
          />
        ) : (
          <input
            {...params}
            value={value}
            maxLength={614}
            disabled={disable}
            onFocus={onFocusCallback}
            onPaste={onPasteCallback}
            onBlur={onBlurCallBack}
            data-testid={dataTestId}
            className={`${classes.Input} ${extendInputClass}`}
            onChange={onChangeWrapper}
            placeholder={placeHolder ?? ''}
            type={type ?? (!withLock || password ? 'text' : 'password')}
          />
        )}
      </Grid>
      {sideButton && (
        <InputSideButton isConfirmedState={sideButtonClicked} sideButtonAction={sideButtonAction} isDisabled={sideButtonDisabled} sideButtonLabel={sideButtonLabel ?? 'Confirm'} />
      )}
      {withSideText && (
        <Grid item className={classes.Text}>
          {isShowSsvLogo && <SsvLogo />}
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
