import React from 'react';
import Button from '@mui/material/Button';
import Spinner from '~app/components/common/Spinner';
import { useStyles } from './PrimaryButton.styles';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsLoading } from '~app/redux/appState.slice';

type Props = {
  children: string | JSX.Element;
  disable?: boolean;
  isLoading?: boolean;
  submitFunction: any;
  dataTestId?: string;
  wrapperClass?: string;
  errorButton?: boolean;
  withoutLoader?: boolean;
};

const PrimaryButton = (props: Props) => {
  const {
    children,
    submitFunction,
    disable,
    wrapperClass,
    dataTestId,
    errorButton,
    withoutLoader,
    isLoading,
  } = props;
  const classes = useStyles({ errorButton });
  const appStateIsLoading = useAppSelector(getIsLoading);

  const showLoaderCondition = appStateIsLoading || isLoading && !withoutLoader;
  const isLoadingClassCondition = appStateIsLoading || isLoading;
  const isDisabledCondition = disable || appStateIsLoading;

  return (
    <Button
      type="submit"
      onClick={submitFunction}
      data-testid={dataTestId}
      disabled={isDisabledCondition}
      className={`${isLoadingClassCondition ? classes.Loading : classes.PrimaryButton} ${wrapperClass}`}
    >
      {showLoaderCondition && <Spinner errorSpinner={errorButton}/>}
      {children}
    </Button>
  );
};

export default PrimaryButton;
