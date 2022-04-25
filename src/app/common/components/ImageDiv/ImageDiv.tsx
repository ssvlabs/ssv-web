import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useStyles } from './imageDiv.styles';

type ImageDivProps = {
    image: string;
    width: number;
    height: number;
};

const ImageDiv = (props: ImageDivProps) => {
    const { image, width, height } = props;
    const classes = useStyles({ image, width, height });

    return (
      <Grid item className={classes.Image} />
    );
};

export default observer(ImageDiv);
