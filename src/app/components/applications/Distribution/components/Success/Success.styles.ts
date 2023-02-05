import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    Wrapper: {
        fontSize: 16,
        borderRadius: 8,
        fontWeight: 500,
        lineHeight: 1.62,
        fontStretch: 'normal',
        letterSpacing: 'normal',
    },
    AddSsvToWallet: {
        height: 60,
        marginBottom: 27,
        cursor: 'pointer',
        textAlign: 'left',
        fontStyle: 'normal',
        alignItems: 'center',
        color: theme.colors.gray90,
        padding: '14px 0px 14px 16px',
        backgroundColor: theme.colors.gray0,
        border: `solid 1px ${theme.colors.gray20}`,
    },
    MetaMask: {
        width: 32,
        height: 32,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/wallets/metamask.svg)',
    },
    EtherScan: {
        marginBottom: 33,
        cursor: 'pointer',
        textAlign: 'center',
        textDecoration: 'underline',
        color: theme.colors.primaryBlue,
    },
}));
