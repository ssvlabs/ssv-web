import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
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
        border: `solid 1px ${theme.colors.gray20}`,
        width: (props: any) => props.walletConnected ? 189 : 171,
        backgroundColor: (props: any) => {
            if (props.whiteAppBar) {
                return theme.colors.gray10;
            }
            if (props.walletConnected) {
                return theme.colors.white;
            }
            return theme.colors.primaryBlue;
        },
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
