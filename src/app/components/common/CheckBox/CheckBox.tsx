import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import { useStyles } from '~app/components/common/CheckBox/CheckBox.styles';

type Props = {
  text: any,
  width?: number,
  height?: number,
  disable?: boolean,
  isChecked?: boolean,
  onClickCallBack?: any,
  grayBackGround?: boolean,
};

const CheckBox = (props: Props) => {
  const { width, height, text, disable, isChecked, onClickCallBack, grayBackGround } = props;
  const [checked, setChecked] = useState(isChecked ?? false);
  const classes = useStyles({ grayBackGround, checked, width, height });

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
