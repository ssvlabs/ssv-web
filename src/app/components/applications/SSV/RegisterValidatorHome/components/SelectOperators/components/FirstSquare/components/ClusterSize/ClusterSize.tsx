import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
    useStyles,
} from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/ClusterSize/ClusterSize.styles';

const ClusterSize = ({ currentClusterSize, changeClusterSize }: { currentClusterSize: number, changeClusterSize: Function }) => {
    const classes = useStyles();
    const sizes = [4, 7, 10, 13];

    return (
        <Grid className={classes.ClusterSizeWrapper}>
            <Typography className={classes.Title}>Cluster Size</Typography>
            {sizes.map((size: number) => <Grid onClick={() => changeClusterSize(size)} className={`${classes.ClusterSizeButton} ${size === currentClusterSize && classes.ChosenClusterSize}`}>{size}</Grid>)}
        </Grid>
    );
};

export default ClusterSize;