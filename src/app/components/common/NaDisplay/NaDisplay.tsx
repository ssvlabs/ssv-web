import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ToolTip from '~app/components/common/ToolTip';
import { useStyles } from '~app/components/common/NaDisplay/NaDisplay.styles';

type NaDisplayProps = {
  size?: number;
  text: string;
  weight?: number;
  tooltipClassExtend?: string;
};
const NaDisplay = ({
  size,
  weight,
  text,
  tooltipClassExtend = undefined
}: NaDisplayProps) => {
  const classes = useStyles({ size, weight });

  return (
    <Grid container item alignItems={'center'}>
      <Typography className={classes.LightGrey}>N/A</Typography>
      &nbsp;
      <ToolTip
        classExtend={tooltipClassExtend}
        placement={'right'}
        text={text}
      />
    </Grid>
  );
};

export default observer(NaDisplay);
