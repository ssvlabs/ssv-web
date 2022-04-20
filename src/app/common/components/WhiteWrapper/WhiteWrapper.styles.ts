import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    WhiteWrapper: {
        padding: '0px 300px',
        backgroundColor: theme.colors.white,
    },
    HeaderWrapper: {
        '& p': {
            fontSize: 24,
            fontWeight: 800,
            lineHeight: 1.24,
            textAlign: 'left',
            letterSpacing: -0.25,
            color: theme.colors.gray90,
        },
    },
    CancelWrapper: {
        cursor: 'pointer',
        justifyContent: 'flex-end',
        gap: 8,
        '& p': {
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 1.25,
            color: theme.colors.gray40,
        },
    },
    CancelImage: {
        width: 20,
        height: 20,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(/images/x/${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
}));