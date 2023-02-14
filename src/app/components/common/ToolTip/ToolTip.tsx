import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStyles } from './ToolTip.styles';
import AnchorTooltip from './components/AnchorTooltip';

type ToolTipProps = {
  text?: any,
  classExtend?: string,
};

const ToolTip = ({ text, classExtend }: ToolTipProps) => {
  const classes = useStyles();

  return <AnchorTooltip title={text} placement={'top'}>
    <Grid className={`${classes.ToolTipWrapper} ${classExtend}`} />
  </AnchorTooltip>;
};
export default observer(ToolTip);
