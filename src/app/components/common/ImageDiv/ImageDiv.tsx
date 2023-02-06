import React from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useStyles } from './imageDiv.styles';

type ImageDivProps = {
    onClick?: any;
    image: string;
    width: number;
    height: number;
};

const ImageDiv = (props: ImageDivProps) => {
    const { onClick, image, width, height } = props;
    const classes = useStyles({ image, width, height });

    return (
      <Grid onClick={onClick} item className={classes.Image} />
    );
};

export default observer(ImageDiv);
