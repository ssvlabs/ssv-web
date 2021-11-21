import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    DepositWrapper: {},
    BalanceWrapper: {
        width: '528px',
        height: '80px',
        margin: '8px 0 0',
        padding: '16px',
        borderRadius: '6px',
        border: 'solid 1px #e1e5ec',
        backgroundColor: '#f7f8fb',
    },
    MaxButtonWrapper: {
        justifyContent: 'right',
    },
    MaxButtonImage: {
        fontFamily: 'Encode Sans',
        cursor: 'pointer',
    },
    Balance: {
        backgroundColor: 'transparent',
        border: 'none !important',
        fontSize: '28px',
        fontWeight: 500,
        lineHeight: '0.86',
        color: '#a1acbe',
        '&:focus': {
            outline: 'none',
        },
        '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            display: 'none',
        },
    },
    MaxButtonText: {
        fontSize: '24px',
        fontWeight: 500,
        lineHeight: 1,
        textAlign: 'right',
        color: '#2a323e',
        margin: '0px 0.7px 0px 15.3px',
    },
    WalletBalance: {
        marginRight: '0.7px',
        textAlign: 'right',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.43,
        color: '#5b6c84',
        cursor: 'pointer',
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
}));
