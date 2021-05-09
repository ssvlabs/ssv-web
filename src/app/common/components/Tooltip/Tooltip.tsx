import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useStyles } from './Tooltip.styles';

type ToolTipProps = {
    text?: string,
};

const Tooltip = ({ text }: ToolTipProps) => {
    const [isShown, setIsShown] = useState(false);
    const classes = useStyles();
    return (
      <div className={classes.toolTipWrapper}
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        <img className={classes.image} src={'/images/information-notice.png'} />
        {isShown && <div className={classes.toolTipText}>{text}</div> }
      </div>
    );
};
export default observer(Tooltip);
