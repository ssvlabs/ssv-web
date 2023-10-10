import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    CustomWrapper: {
        width: '844px',
    },
    ExtendWrapper: {
        width: '844px',
        height: '421px',
        backgroundPositionX: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:  'url(/images/backgroundIcon/light.svg)',
        padding: 32,
    },
    MigrationWrapper: {
        gap: 40,
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
    MigrationLogo: {
        width: 279,
        height: 124,
        marginLeft: 150,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage:  'url(/images/migration/migration-logo.svg)',
    },
}));
