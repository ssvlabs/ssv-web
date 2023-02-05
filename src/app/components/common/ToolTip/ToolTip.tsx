import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { useStyles } from './ToolTip.styles';

type ToolTipProps = {
  text?: any,
  classExtend?: string,
};

const ToolTip = ({ text, classExtend }: ToolTipProps) => {
  const [isShown, setIsShown] = useState(false);
  const classes = useStyles();

  return (
    <Grid className={`${classes.ToolTipWrapper} ${classExtend}`}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {isShown && (
        <Grid className={classes.toolTipText}>
          <Typography>{text}</Typography>
        </Grid>
      )}
    </Grid>
  );
};
export default observer(ToolTip);
