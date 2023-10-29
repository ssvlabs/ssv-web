import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    CustomWrapper: {
        width: '844px',
    },
    ExtendWrapper: {
        width: '844px',
        height: '475px',
        backgroundPositionX: '100%',
        backgroundRepeat: 'no-repeat',
        padding: 32,
    },
    MigrationWrapper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    TextWrapper: {
        gap: 16,
        display: 'flex',
        flexDirection: 'column',
    },
    Title: {
        fontSize: 20,
        fontWeight: 700,
        color: theme.colors.gray90,
        borderBottom: 'none',
    },
    Text: {
        fontSize: 16,
        fontWeight: 500,
        color: theme.colors.gray80,
        borderTop: 'none',
    },
    FileText: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        overflow: 'hidden',
        textAlign: 'center',
        textOverflow: 'ellipsis',
        color: theme.colors.gray40,
    },
    FileImage: {
        width: 48,
        height: 48,
        margin: 'auto',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        marginTop: theme.spacing(20),
        marginBottom: theme.spacing(-4),
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/file/white.svg)',
    },
    FileInputExtendClass: {
        margin: '40px 0px 32px 0px',
    },
    Fail: {
        backgroundImage: 'url(/images/file/fail.svg)',
    },
    Success: {
        backgroundImage: 'url(/images/file/success.svg)',
    },
    ErrorText: {
        color: theme.colors.primaryError,
    },
    SuccessText: {
        color: theme.colors.primarySuccessDark,
    },
    Remove: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        cursor: 'pointer',
        textDecoration: 'underline',
        color: theme.colors.primaryBlue,
        zIndex: theme.opacity.highPriority,
    },
}));
