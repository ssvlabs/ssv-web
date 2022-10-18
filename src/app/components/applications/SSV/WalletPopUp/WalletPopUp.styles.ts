import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    Dialog: {
        width: 424,
        padding: 32,
        borderRadius: 16,
        position: 'relative',
        backgroundColor: theme.colors.white,
    },
    Exit: {
        top: 32,
        right: 32,
        width: 24,
        height: 24,
        zIndex: 99,
        position: 'absolute',
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(/images/exit/${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
    TextWrapper: {
        textAlign: 'center',
        alignItems: 'center',
        alignContent: 'center',
        marginBottom: theme.spacing(1),
    },
    SubHeader: {
        fontSize: 14,
        fontWeight: 600,
        textAlign: 'left',
        lineHeight: 1.14,
        color: theme.colors.gray40,
    },
    Change: {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.62,
        cursor: 'pointer',
        textAlign: 'right',
        textDecoration: 'underline',
        color: theme.colors.primaryBlue,
    },
}));
