import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    ConnectWalletWrapper: {
        gap: 10,
        height: 48,
        fontSize: 16,
        color: '#fff',
        borderRadius: 8,
        fontWeight: 600,
        lineHeight: 1.25,
        cursor: 'pointer',
        textAlign: 'center',
        alignItems: 'center',
        fontFamily: 'Manrope',
        justifyContent: 'center',
        padding: theme.spacing(3, 4, 3, 4),
        width: (props: any) => props.walletConnected ? 189 : 171,
        backgroundColor: (props: any) => props.walletConnected ? theme.colors.white : theme.colors.primaryBlue,
    },
    WalletImage: {
        width: 24,
        height: 24,
        marginRight: theme.spacing(4),
    },
    WalletAddress: {
        margin: 'auto -2px',
        color: (props: any) => props.walletConnected ? theme.colors.gray90 : theme.colors.white,
    },
}));
