import React from 'react';
import Button from '@mui/material/Button';
import Spinner from '~app/components/common/Spinner';
import { useStyles } from './SecondaryButton.styles';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsLoading } from '~app/redux/appState.slice';

type Props = {
    children: string | JSX.Element,
    disable?: boolean,
    className?: string,
    submitFunction: any,
    dataTestId?: string,
    noCamelCase?: boolean,
    withoutLoader?: boolean,
    withoutBackgroundColor?: boolean
};

const SecondaryButton = ({ children, submitFunction, className, disable, withoutLoader, dataTestId, noCamelCase, withoutBackgroundColor }: Props) => {
    const classes = useStyles({ noCamelCase, withoutBackgroundColor });
    const isLoading = useAppSelector(getIsLoading);

    return (
      <Button
        type="submit"
        onClick={submitFunction}
        data-testid={dataTestId}
        className={className ?? classes.SecondaryButton}
        disabled={disable || isLoading}
      >
        {isLoading && !withoutLoader && <Spinner />}
        {children}
      </Button>
    );
};

export default SecondaryButton;
