import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    SubHeader: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray80,
    },
    DropZone: {
        height: 254,
        borderRadius: 8,
        marginBottom: theme.spacing(5),
        backgroundColor: theme.colors.gray0,
        border: `solid 1px ${theme.colors.gray20}`,
    },
    Input: {
        display: 'none',
    },
    FileImage: {
        width: 48,
        height: 48,
        margin: 'auto',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        marginTop: theme.spacing(20),
        backgroundRepeat: 'no-repeat',
        marginBottom: theme.spacing(0),
        backgroundImage: 'url(/images/file/white.svg)',
    },
    Fail: {
        backgroundImage: 'url(/images/file/fail.svg)',
    },
    Success: {
        backgroundImage: 'url(/images/file/success.svg)',
    },
    FileText: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        textAlign: 'center',
        color: theme.colors.gray40,
    },
    Browse: {
        fontSize: 16,
        zIndex: 999999,
        fontWeight: 500,
        lineHeight: 1.62,
        cursor: 'pointer',
        textDecoration: 'underline',
        color: theme.colors.primaryBlue,
    },
    Remove: {
        fontSize: 16,
        zIndex: 999999,
        fontWeight: 500,
        lineHeight: 1.62,
        cursor: 'pointer',
        marginTop: theme.spacing(2),
        textDecoration: 'underline',
        color: theme.colors.primaryBlue,
    },
    ErrorText: {
        color: theme.colors.primaryError,
    },
    SuccessText: {
        color: theme.colors.primarySuccessDark,
    },
    TextInput: {
        marginBottom: theme.spacing(10),
    },
}));
