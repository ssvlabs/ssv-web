import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

type CopyButtonProps = {
    textCopied: boolean;
    classes: any;
    onClickHandler: any;
};
export const CopyButton = ({ textCopied, classes, onClickHandler }: CopyButtonProps) => {
    if (!textCopied) {
        return <Grid item className={classes.CopyButton} onClick={onClickHandler}>Copy</Grid>;
    }
    return <Grid onClick={onClickHandler} container item className={classes.ButtonCopied}>
        <Typography className={classes.TextCopied}>Copied</Typography>
        <Grid className={classes.V}/>
    </Grid>;
};

