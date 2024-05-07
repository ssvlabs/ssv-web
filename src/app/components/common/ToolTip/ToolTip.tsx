
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStyles } from './ToolTip.styles';
import AnchorTooltip from './components/AnchorTooltip';

type ToolTipProps = {
  text?: any,
  classExtend?: string,
  placement?: 'top' | 'bottom' | 'left' | 'right',
};

const ToolTip = ({ text, classExtend, placement }: ToolTipProps) => {
  const classes = useStyles();

  return <AnchorTooltip title={text} placement={placement || 'top'}>
    <Grid className={`${classes.ToolTipWrapper} ${classExtend}`} />
  </AnchorTooltip>;
};
export default observer(ToolTip);
