import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => {
    return {
        BalanceWrapper: {
            height: 93,
            margin: '8px 0 0',
            borderRadius: 8,
            padding: theme.spacing(4, 5, 4, 5),
            border: `solid 1px ${theme.colors.gray20}`,
            backgroundColor: theme.colors.gray0,
        },
        MaxButtonWrapper: {
            justifyContent: 'right',
            marginBottom: 3,
        },
        MaxButton: {
            width: 80,
            height: 36,
            fontSize: 16,
            borderRadius: 8,
            fontWeight: 600,
            lineHeight: 1.25,
            cursor: 'pointer',
            padding: '8px 22px 8px 23px',
            color: theme.colors.primaryBlue,
            backgroundColor: theme.colors.tint90,
        },
        Balance: {
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 0.86,
            border: 'none !important',
            color: theme.colors.black,
            backgroundColor: theme.colors.gray0,
            '&:focus': {
                '-webkit-appearance': 'none',
                outline: 'none',
            },
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
                display: 'none',
            },
        },
        MaxButtonText: {
            width: 52,
            height: 35,
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.24,
            letterSpacing: -0.5,
            margin: theme.spacing(0, 0, 1, 5),
            color: theme.colors.black,
        },
        WalletBalance: {
            fontSize: 16,
            fontWeight: 500,
            lineHeight: 1.62,
            textAlign: 'right',
            color: theme.colors.gray40,
        },
        AmountOfDays: {
            marginTop: '16px',
            fontSize: '24px',
            fontWeight: 500,
            lineHeight: 1,
            textAlign: 'left',
            color: '#2a323e',
        },
        ButtonWrapper: {
            margin: '16px',
        },
    };
});
