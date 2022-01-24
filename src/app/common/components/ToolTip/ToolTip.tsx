import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { getImage } from '~lib/utils/filePath';
import { useStyles } from './ToolTip.styles';

type ToolTipProps = {
    link?: any,
    text?: string,
};

const ToolTip = ({ text, link }: ToolTipProps) => {
    const [isShown, setIsShown] = useState(false);
    const classes = useStyles();
    link;
    return (
      <Grid container item className={classes.ToolTipWrapper}
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        <img className={classes.ToolTip} src={getImage('hint.svg')} />
        {isShown && (
          <div className={classes.toolTipText}>
            {text}
          </div>
        )}
      </Grid>
    );
};
export default observer(ToolTip);
