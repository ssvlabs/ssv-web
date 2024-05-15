
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { useStyles } from '~app/components/common/AppLinksToggle/AppLinksToggle.styles';

const AppLinkOption = ({ optionLabel, link, bottomLine }: { optionLabel: string, link: string, bottomLine: boolean }) => {
    const classes = useStyles({ bottomLine });

    const onClickHandler = () => {
        window.open(link, '_blank');
    };

    return (
        <Grid container item className={classes.Button} onClick={onClickHandler}>
            <Typography className={classes.OptionLabel}>{optionLabel}</Typography>
            <Grid className={classes.Icon}/>
        </Grid>
    );
};

export default AppLinkOption;
