import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    validatorTextWrapper: {
        marginBottom: '20px',
    },
    InsufficientBalanceWrapper: {
        padding: '10px 18px 10px 16px',
        borderRadius: '1px',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.43,
        color: '#ec1c26',
        background: 'rgb(236, 28, 38, 0.08)',
        marginTop: '10px',
    },
    SufficientBalanceWrapper: {
        padding: '10px 18px 10px 16px',
        borderRadius: '1px',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.43,
        color: '#5b6c84',
        background: 'rgb(236, 168, 28, 0.12)',
        marginTop: '10px',
    },
    validatorText: {
        marginBottom: '6px',
        fontFamily: 'Encode Sans',
        fontStyle: 'normal',
        color: '#A1ACBE',
        fontSize: '12px',
        fontWeight: 'bold',
    },
    etherLink: {
        fontFamily: 'Encode Sans',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        textDecoration: 'underline',
        color: '#2B47E3',
    },
    ReadMore: {
        float: 'right',
        textDecoration: 'underline',
    },
    NameAndAddressWrapper: {
        marginBottom: '10px',
    },
    GreenColor: {
        fontSize: '18px',
        fontWeight: 900,
        lineHeight: 1.28,
        color: 'rgb(32, 238, 200)',
    },
    TotalWrapper: {
        marginTop: '10px',
    },
}));
