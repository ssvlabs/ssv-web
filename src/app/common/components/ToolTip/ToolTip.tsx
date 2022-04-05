import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { useStyles } from './ToolTip.styles';
import Typography from '@material-ui/core/Typography';

type ToolTipProps = {
    link?: any,
    text?: string,
};

const ToolTip = ({ text, link }: ToolTipProps) => {
    const [isShown, setIsShown] = useState(false);
    const classes = useStyles();
    link;
    return (
      <Grid className={classes.ToolTipWrapper}
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
