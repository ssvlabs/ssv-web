import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from '~app/components/common/CheckBox/CheckBox.styles';
import CheckboxStore from '~app/common/stores/applications/SsvWeb/Checkbox.store';
import AnchorTooltip from '~app/components/common/ToolTip/components/AnchorTooltip/AnchorTooltIp';

type CheckboxProps = {
  text: any,
  width?: number,
  height?: number,
  disable?: boolean,
  isChecked?: boolean,
  smallLine?: boolean,
  onClickCallBack?: any,
  grayBackGround?: boolean,
  withTooltip?: boolean,
  tooltipText?: JSX.Element | string,
  withoutMarginBottom?: boolean
};

const CheckBox = ({
                    width,
                    height,
                    text,
                    disable,
                    isChecked,
                    onClickCallBack,
                    grayBackGround,
                    withoutMarginBottom,
                    smallLine,
                    withTooltip,
                    tooltipText,
                  }: CheckboxProps) => {
  const stores = useStores();
  const checkboxStore: CheckboxStore = stores.Checkbox;
  const [checked, setChecked] = useState(isChecked);
  const classes = useStyles({
    grayBackGround,
    checked: isChecked ?? checked,
    width,
    height,
    withoutMarginBottom,
    smallLine,
  });
  useEffect(() => {
    if (!isChecked) {
      checkboxStore.setCheckboxStateFalse();
    }
  }, []);

  const checkAction = () => {
    if (disable) return;
    setChecked(!checked);
    onClickCallBack && onClickCallBack(!checked);
  };

  if (withTooltip && tooltipText) {
    return (
      <AnchorTooltip title={tooltipText} placement={'top'}>
        <Grid container={!!text} className={classes.CheckBoxWrapper} onClick={checkAction}>
          <Grid item>
            <Grid className={classes.BoxWrapper}/>
          </Grid>
          <Grid item className={classes.Text}>
            <Grid>{text}</Grid>
          </Grid>
        </Grid>
      </AnchorTooltip>
    );
  }

  return (
    <Grid container={!!text} className={classes.CheckBoxWrapper} onClick={checkAction}>
      <Grid item>
        <Grid className={classes.BoxWrapper}/>
      </Grid>
      <Grid item className={classes.Text}>
        <Grid>{text}</Grid>
      </Grid>
    </Grid>
  );
};

export default CheckBox;
