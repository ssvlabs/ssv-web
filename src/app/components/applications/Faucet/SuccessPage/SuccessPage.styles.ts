import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    Wrapper: {
        gap: 32,
    },
    TextWrapper: {
        gap: 24,
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray80,
    },
    AddToMetamask: {
        gap: 20,
        height: 60,
        borderRadius: 8,
        cursor: 'pointer',
        alignItems: 'center',
        padding: '14px 16px 14px 16px',
        backgroundColor: theme.colors.gray0,
        border: `solid 1px ${theme.colors.gray20}`,
    },
    MetaMask: {
        width: 32,
        height: 32,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        marginLeft: theme.spacing(2),
        backgroundImage: 'url(/images/wallets/metamask.svg)',
    },
}));
