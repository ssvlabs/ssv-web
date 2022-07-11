import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
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
        backgroundImage: 'url(/images/backgroundIcon/light.svg)',
    },
}));
