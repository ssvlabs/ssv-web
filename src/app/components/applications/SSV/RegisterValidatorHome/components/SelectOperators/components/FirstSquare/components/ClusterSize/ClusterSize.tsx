
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import {
    useStyles,
} from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/ClusterSize/ClusterSize.styles';

const ClusterSize = ({ currentClusterSize, changeClusterSize }: { currentClusterSize: number, changeClusterSize: Function }) => {
    const stores = useStores();
    const operatorStore: OperatorStore = stores.Operator;
    const classes = useStyles();
    const sizes = [4, 7, 10, 13];

    const clusterSizeHandler = (clusterSize: number) => {
        changeClusterSize(clusterSize);
        for (const key of Object.keys(operatorStore.selectedOperators)) {
            if (Number(key) > clusterSize) {
                operatorStore.unselectOperator(Number(key));
            }
        }
    };

    return (
        <Grid className={classes.ClusterSizeWrapper}>
            <Typography className={classes.Title}>Cluster Size</Typography>
            {sizes.map((size: number, index: number) => <Grid key={`${size}${index}`} onClick={() => clusterSizeHandler(size)} className={`${classes.ClusterSizeButton} ${size === currentClusterSize && classes.ChosenClusterSize}`}>{size}</Grid>)}
        </Grid>
    );
};

export default ClusterSize;
