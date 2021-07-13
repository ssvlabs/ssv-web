import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useStyles } from './Tooltip.styles';

type ToolTipProps = {
    text?: string,
    link?: string
};

const Tooltip = ({ text, link }: ToolTipProps) => {
    const [isShown, setIsShown] = useState(false);
    const classes = useStyles();
    return (
      <div className={classes.toolTipWrapper}
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        <img className={classes.image} src={'/images/hint.svg'} />
        {isShown && (
        <div className={classes.toolTipText}>
            {text}
            {link ? <a className={classes.toolTipLink} target="_blank" href={link}>documentation</a> : ''}
        </div>
      )}
      </div>
    );
};
export default observer(Tooltip);
