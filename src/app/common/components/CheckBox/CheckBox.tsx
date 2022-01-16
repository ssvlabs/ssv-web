import React, { useState } from 'react';
import { useStyles } from './CheckBox.styles';
import { Grid } from '@material-ui/core';

type Props = {
    text: any,
    onClickCallBack?: any,
};

const CheckBox = (props: Props) => {
    const { text, onClickCallBack } = props;
    const classes = useStyles();
    const [checked, setChecked] = useState(false);

    const checkAction = () => {
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
