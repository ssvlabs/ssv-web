import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import { useStyles } from '~app/components/common/InputLabel//InputLable.styles';

type InputLabelProps = {
    title?: string,
    withHint?: boolean,
    toolTipText?: any,
    additionalLabel?: string,
};

const InputLabel = ({ title, withHint, toolTipText, additionalLabel }: InputLabelProps) => {
    const classes = useStyles();
    return (
      <Grid container className={classes.Wrapper}>
        <Typography className={classes.Text}>
          {title}
        </Typography>
        <Typography className={classes.AdditionalLabel}>
          {additionalLabel}
        </Typography>
        {withHint && <Tooltip text={toolTipText} />}
      </Grid>
    );
};

export default InputLabel;
