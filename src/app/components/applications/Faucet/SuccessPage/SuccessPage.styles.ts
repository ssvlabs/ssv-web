import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
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
        marginLeft: theme.spacing(2),
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/wallets/metamask.svg)',
    },
}));
