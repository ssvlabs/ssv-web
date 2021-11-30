import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useStyles } from './NewToolTip.styles';
import { getImage } from '~lib/utils/filePath';
import { Grid } from '@material-ui/core';

type ToolTipProps = {
    text: string,
};

const NewToolTip = ({ text }: ToolTipProps) => {
    const [isShown, setIsShown] = useState(false);
    const classes = useStyles();
    return (
      <Grid className={classes.ToolTipWrapper}
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        <img className={classes.ToolTip} src={getImage('information-notice.png')} />
        {isShown && (
          <div className={classes.toolTipText}>
            {text}
          </div>
        )}
      </Grid>
    );
};
export default observer(NewToolTip);
