import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from '~app/components/common/CheckBox/CheckBox.styles';
import CheckboxStore from '~app/common/stores/applications/SsvWeb/Checkbox.store';

type CheckboxProps = {
  text: any,
  width?: number,
  height?: number,
  disable?: boolean,
  isChecked?: boolean,
  onClickCallBack?: any,
  grayBackGround?: boolean,

};

const CheckBox = ({ width, height, text, disable, isChecked, onClickCallBack, grayBackGround }: CheckboxProps) => {
  const stores = useStores();
  const checkboxStore: CheckboxStore = stores.Checkbox;
  const [checked, setChecked] = useState(isChecked ?? false);
  const classes = useStyles({ grayBackGround, checked, width, height });

  useEffect(() => {
      checkboxStore.setCheckboxStateFalse();
  }, []);

  const checkAction = () => {
    if (disable) return;
    setChecked(!checked);
    onClickCallBack && onClickCallBack(!checked);
  };

  return (
    <Grid container className={classes.CheckBoxWrapper} onClick={checkAction}>
      <Grid item>
        <Grid className={classes.BoxWrapper} />
      </Grid>
      <Grid item className={classes.Text}>
        <Grid>{text}</Grid>
      </Grid>
    </Grid>
  );
};

export default CheckBox;
