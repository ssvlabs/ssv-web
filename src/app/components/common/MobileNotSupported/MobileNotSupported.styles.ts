import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    Wrapper: {
        height: 481,
        margin: '42px 0 0',
        padding: '32px 32px 89px',
        backgroundColor: theme.colors.white,
    },
    Header: {
        height: 56,
        fontSize: 20,
        lineHeight: 1.4,
        marginBottom: 12,
        textAlign: 'left',
        fontWeight: 'bold',
        fontStyle: 'normal',
        fontFamily: 'Manrope',
        fontStretch: 'normal',
        letterSpacing: 'normal',
        color: theme.colors.gray90,
    },
    SubHeader: {
        height: 52,
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        marginBottom: 60,
        textAlign: 'left',
        fontStyle: 'normal',
        fontStretch: 'normal',
        fontFamily: 'Manrope',
        letterSpacing: 'normal',
        color: theme.colors.gray80,
    },
    Image: {
        width: 280,
        height: 180,
        margin: 'auto',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(/images/not_support_mobile/${theme.darkMode ? 'light' : 'light'}.svg)`,
    },
}));
