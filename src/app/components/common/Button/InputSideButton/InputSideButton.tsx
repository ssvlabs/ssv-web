
import Grid from '@mui/material/Grid';
import { useStyles } from '~app/components/common/Button/InputSideButton/InputSideButton.styles';

const InputSideButton = ({ sideButtonAction, sideButtonLabel, disabled, confirmedState }: { sideButtonAction: any, sideButtonLabel: string, disabled?: boolean, confirmedState?: boolean }) => {
    const classes = useStyles({ confirmedState });

    return (
        <Grid onClick={sideButtonAction} className={`${classes.SideButton} ${disabled && classes.Disable}`}>{sideButtonLabel}</Grid>
    );
};

export default InputSideButton;