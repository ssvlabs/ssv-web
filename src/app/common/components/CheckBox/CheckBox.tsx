import React, { useState } from 'react';
import { useStyles } from './CheckBox.styles';
import { Grid } from '@material-ui/core';

type Props = {
    text: any,
    disable?: boolean,
    onClickCallBack?: any,
    grayBackGround?: boolean,
};

const CheckBox = (props: Props) => {
    const { text, disable, onClickCallBack, grayBackGround } = props;
    const classes = useStyles({ grayBackGround });
    const [checked, setChecked] = useState(false);

    const checkAction = () => {
        console.log(disable);
        if (disable) return;
        setChecked(!checked);
        onClickCallBack && onClickCallBack(!checked);
    };
    
    return (
      <Grid container className={classes.CheckBoxWrapper} onClick={checkAction}>
        <Grid item>
          <Grid className={`${classes.BoxWrapper} ${checked ? classes.Checked : ''}`} />
        </Grid>
        <Grid item className={classes.Text}>
          <Grid>{text}</Grid>
        </Grid>
      </Grid>
    );
};

export default CheckBox;
