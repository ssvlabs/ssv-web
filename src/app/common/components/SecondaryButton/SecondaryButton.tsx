import React from 'react';
import { observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import { useStyles } from './SecondaryButton.styles';

type Props = {
    text: string,
    onClick: any,
    dataTestId?: string,
};

const SecondaryButton = (props: Props) => {
    const { text, onClick, dataTestId } = props;
    const classes = useStyles();
    return (
      <Button
        className={classes.SecondaryButton}
        data-testid={dataTestId}
        onClick={onClick}
        >
        {text}
      </Button>
    );
};

export default observer(SecondaryButton);
