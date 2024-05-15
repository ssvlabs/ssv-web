
import { Grid, Typography } from '@mui/material';
import {
    useStyles,
} from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/OperatorBox/NotificationPopUp/NotificationPopUp.styles';

type ProcessElementProps = {
    step: string;
    title: string;
    text: string;
};

const ProcessElement = ({ step, title, text }: ProcessElementProps) => {
    const classes = useStyles({ step });

    return (
        <Grid className={classes.ProcessElement}>
            <Typography className={classes.Step}>
               {`${step}. ${title}`}
            </Typography>
            <Typography className={classes.ProcessText}>{text}</Typography>
        </Grid>
    );
};

export default ProcessElement;