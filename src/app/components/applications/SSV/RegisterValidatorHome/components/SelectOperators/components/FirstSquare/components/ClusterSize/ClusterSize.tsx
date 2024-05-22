import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/ClusterSize/ClusterSize.styles';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook.ts';
import { getSelectedOperators, unselectOperator } from '~app/redux/operator.slice.ts';

const ClusterSize = ({ currentClusterSize, changeClusterSize }: { currentClusterSize: number; changeClusterSize: Function }) => {
  const classes = useStyles();
  const sizes = [4, 7, 10, 13];
  const selectedOperators = useAppSelector(getSelectedOperators);
  const dispatch = useAppDispatch();

  const clusterSizeHandler = (clusterSize: number) => {
    changeClusterSize(clusterSize);
    for (const key of Object.keys(selectedOperators)) {
      if (Number(key) > clusterSize) {
        dispatch(unselectOperator(Number(key)));
      }
    }
  };

  return (
    <Grid className={classes.ClusterSizeWrapper}>
      <Typography className={classes.Title}>Cluster Size</Typography>
      {sizes.map((size: number, index: number) => (
        <Grid
          key={`${size}${index}`}
          onClick={() => clusterSizeHandler(size)}
          className={`${classes.ClusterSizeButton} ${size === currentClusterSize && classes.ChosenClusterSize}`}
        >
          {size}
        </Grid>
      ))}
    </Grid>
  );
};

export default ClusterSize;
