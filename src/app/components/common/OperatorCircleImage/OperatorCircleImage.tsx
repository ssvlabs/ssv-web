
import Grid from '@mui/material/Grid';
import { useStyles } from '~app/components/common/OperatorCircleImage/OperatorCircleImage.styles';

const OperatorCircleImage = ( { operatorLogo }: { operatorLogo: string }) => {
    const classes = useStyles({ operatorLogo });

    return (
        <Grid item className={classes.CircleImageOperator} />
    );
};

export default OperatorCircleImage;
