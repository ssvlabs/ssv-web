import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    WhiteWrapper: {
        backgroundColor: theme.colors.white,
    },
    Wrapper: {
        margin: 'auto',
        maxWidth: 1320,
        '@media only screen and (max-width: 1400px)': {
            margin: 'auto',
            maxWidth: '80%',
        },
    },
    BackButtonWrapper: {
        marginBottom: 20,
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

    Settings: {
        gap: 8,
        top: -20,
        right: 0,
        width: 272,
        height: 88,
        display: 'flex',
        padding: '16px',
        borderRadius: 16,
        position: 'absolute',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: theme.colors.white,
        boxShadow: '0 12px 40px 0 #0116271e',
        border: `solid 1px ${theme.colors.gray10}`,
    },
    Button: {
        gap: 10,
        height: 56,
        flexGrow: 0,
        fontSize: 16,
        borderRadius: 8,
        display: 'flex',
        fontWeight: 600,
        lineHeight: 1.25,
        cursor: 'pointer',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '18px 24px',
        justifyContent: 'flex-start',
        color: theme.colors.primaryError,
    },
    CancelWrapper: {
        justifyContent: 'flex-end',
        gap: 8,
        '& p': {
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 1.25,
            cursor: 'pointer',
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
    Options: {
        width: 40,
        height: 40,
        float: 'right',
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(/images/kebab/${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
    SettingsWrapper: {
        top: 60,
        position: 'relative',
    },
    ChildWrapper: {
        marginTop: 16,
    },
    DialogWrapper: {
        width: 424,
        padding: 32,
        height: 222,
        borderRadius: 16,
        backgroundColor: theme.colors.white,
    },
    ButtonsWrapper: {
        gap: 24,
    },
}));