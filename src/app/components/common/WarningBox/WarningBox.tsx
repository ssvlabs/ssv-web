import React from 'react';
import Grid from '@mui/material/Grid';
import { useStyles } from './WarningBox.styles';

type InputProps = {
    text: string | JSX.Element,
    width?: number,
    height?: number,
};

const WarningBox = ({ text, width, height }: InputProps) => {
    const classes = useStyles({ width, height });

    return (
      <Grid container className={classes.Wrapper}>
        {text}
      </Grid>
    );
};

export default WarningBox;
