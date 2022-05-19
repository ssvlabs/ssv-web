import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    LinkButtonWrapper: {
        width: 280,
        display: 'flex',
        cursor: 'pointer',
        textAlign: 'center',
        alignItems: 'center',
        '&:nth-of-type(1)': {
            marginRight: '20px',
        },
    },
    BackgroundImage: {
        top: -60,
        right: -65,
        width: 226,
        height: 345,
        position: 'absolute',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: theme.darkMode ? 0.5 : 0.05,
        backgroundImage: `url(/images/logo/${theme.darkMode ? 'small_light' : 'small_light'}.svg)`,
    },
}));
