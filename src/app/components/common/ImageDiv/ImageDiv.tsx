import React, { useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useStyles } from './imageDiv.styles';

type ImageDivProps = {
    onClick?: any;
    image: string;
    width: number;
    height: number;
    setOpenExplorerRefs?: Function;
};

const ImageDiv = (props: ImageDivProps) => {
    const { onClick, image, width, height, setOpenExplorerRefs } = props;
    const classes = useStyles({ image, width, height });
    const ref = useRef(null);

    useEffect(() => {
        if (setOpenExplorerRefs) {
            setOpenExplorerRefs((state: any) => [...state, ref.current]);
        }
    }, []);

    return (
      <Grid onClick={onClick} ref={ref} item className={classes.Image} />
    );
};

export default observer(ImageDiv);
