
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStyles } from '~app/components/common/FeeUpdateTo/ChangeFeeDisplayValues.styles';

type PreviousNextFeeProps = {
    newFee: number | string;
    oldFee: number | string;
    currentCurrency: string;
    negativeArrow?: boolean;
};

const ChangeFeeDisplayValues = ({ oldFee, newFee, currentCurrency = 'SSV', negativeArrow = false } : PreviousNextFeeProps ) => {
    const classes = useStyles({ negativeArrow });
    return (
        <Grid container className={classes.ContainerWrapper}>
            <Typography className={classes.FeeValue}>{`${oldFee} ${currentCurrency}`}</Typography>
            <Grid item className={classes.ArrowImage} />
            <Typography className={classes.FeeValue}>{`${newFee} ${currentCurrency}`}</Typography>
        </Grid>
    );
};

export default ChangeFeeDisplayValues;