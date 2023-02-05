import React from 'react';
import { Grid, Typography } from '@mui/material';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import { useStyles } from './InputLable.styles';

type InputLabelProps = {
  title?: string,
  withHint?: boolean,
  toolTipText?: any,
};

const InputLabel = ({ title, withHint, toolTipText }: InputLabelProps) => {
  const classes = useStyles();

    return (
      <Grid container className={classes.Wrapper}>
        <Typography className={classes.Text}>
          {title}
        </Typography>
        {withHint && <Tooltip text={toolTipText} />}
      </Grid>
    );
};

export default InputLabel;
