import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useStyles } from './PrimaryButton.styles';

type Props = {
    text: string,
    onClick: any,
    disable?: boolean,
    dataTestId?: string,
};

const PrimaryButton = (props: Props) => {
    const classes = useStyles();
    const { text, onClick, disable, dataTestId } = props;
    const [inProgress, setInProgress] = useState(false);

    useEffect(() => {
        const listener = async (event: any) => {
            if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                // event.preventDefault();
                if (!inProgress) {
                    setInProgress(true);
                    await onClick();
                }
            }
        };
        document.addEventListener('keydown', listener);
        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, [inProgress]);

    return (
      <Grid container item className={classes.Wrapper}>
        <Button
          className={classes.PrimaryButton}
          data-testid={dataTestId}
          disabled={disable}
          onClick={onClick}
        >
          {text}
        </Button>
      </Grid>
    );
};

export default observer(PrimaryButton);
