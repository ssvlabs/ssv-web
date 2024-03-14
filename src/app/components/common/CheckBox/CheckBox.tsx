import React from 'react';
import Grid from '@mui/material/Grid';
import { useStyles } from '~app/components/common/CheckBox/CheckBox.styles';
import AnchorTooltip from '~app/components/common/ToolTip/components/AnchorTooltip/AnchorTooltIp';

type CheckboxProps = {
  text: any,
  width?: number,
  height?: number,
  isDisable?: boolean,
  isChecked?: boolean,
  smallLine?: boolean,
  grayBackGround?: boolean,
  withTooltip?: boolean,
  tooltipText?: JSX.Element | string,
  withoutMarginBottom?: boolean,
  toggleIsChecked: () => void,
};

const CheckBox = ({
                    width,
                    height,
                    text,
                    isDisable = false,
                    isChecked,
                    grayBackGround,
                    withoutMarginBottom,
                    smallLine,
                    withTooltip,
                    tooltipText,
                    toggleIsChecked,
                  }: CheckboxProps) => {
  const classes = useStyles({
    grayBackGround,
    checked: isChecked,
    width,
    height,
    withoutMarginBottom,
    smallLine,
  });

  const Content = (
    <Grid container={!!text} className={classes.CheckBoxWrapper} onClick={isDisable ? () => {} : toggleIsChecked}>
      <Grid item>
        <Grid className={classes.BoxWrapper}/>
      </Grid>
      <Grid item className={classes.Text}>
        <Grid>{text}</Grid>
      </Grid>
    </Grid>
  );

  return withTooltip && tooltipText ? <AnchorTooltip title={tooltipText} placement={'top'}>{Content}</AnchorTooltip> : Content;
};

export default CheckBox;
