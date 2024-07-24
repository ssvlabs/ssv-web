import Grid from '@mui/material/Grid';
import { ReactElement } from 'react';
import { useStyles } from '~app/components/common/CheckBox/CheckBox.styles';
import { Tooltip } from '~app/components/ui/tooltip';

type CheckboxProps = {
  text: any;
  width?: number;
  height?: number;
  isDisabled?: boolean;
  isChecked?: boolean;
  smallLine?: boolean;
  grayBackGround?: boolean;
  withTooltip?: boolean;
  tooltipText?: ReactElement | string;
  withoutMarginBottom?: boolean;
  toggleIsChecked: () => void;
};

const CheckBox = ({
  width,
  height,
  text,
  isDisabled = false,
  isChecked,
  grayBackGround,
  withoutMarginBottom,
  smallLine,
  withTooltip,
  tooltipText,
  toggleIsChecked
}: CheckboxProps) => {
  const classes = useStyles({
    grayBackGround,
    checked: isChecked,
    width,
    height,
    withoutMarginBottom,
    smallLine
  });

  const Content = (
    <Grid container={!!text} className={classes.CheckBoxWrapper} onClick={isDisabled ? () => {} : toggleIsChecked}>
      <Grid item>
        <Grid className={classes.BoxWrapper} />
      </Grid>
      <Grid item className={classes.Text}>
        <Grid>{text}</Grid>
      </Grid>
    </Grid>
  );

  return withTooltip && tooltipText ? (
    <Tooltip asChild content={tooltipText}>
      {Content}
    </Tooltip>
  ) : (
    Content
  );
};

export default CheckBox;
