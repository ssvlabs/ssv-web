import React from 'react';
import Grid from '@material-ui/core/Grid';
import Tooltip from '~app/common/components/ToolTip/ToolTip';
import { useStyles } from './InputLable.styles';

type InputLabelProps = {
  title?: string,
  withHint?: boolean,
  toolTipLink?: string,
  toolTipText?: string,
};

const InputLabel = ({ title, withHint, toolTipText, toolTipLink }: InputLabelProps) => {
  const classes = useStyles();
    return (
      <Grid container className={classes.Wrapper}>
        <Grid item className={classes.Text}>
          {title}
        </Grid>
        {withHint && (
        <Grid item>
          <Tooltip text={toolTipText} link={toolTipLink} />
        </Grid>
        )}
      </Grid>
    );
};

export default InputLabel;
