import { makeStyles } from '@material-ui/core/styles';
import screenSizes from '~lib/utils/screenSizes';

export const useStyles = makeStyles((theme) => ({
    MyBalanceWrapper: {
        width: '336px',
        '@media (max-width: 1079px)': {
            width: '100%',
        },
        // height: '354px',
        // margin: '20px 16px 115px 20px',
        padding: '16px 0',
        borderRadius: '8px',
        border: 'solid 1px #5b6c84',
        backgroundColor: '#fff',
        marginBottom: '20px',
    },
    SectionWrapper: {
        padding: theme.spacing(8),
    },
    Header: {
        width: '79px',
        height: '28px',
        margin: '0 67px 15.5px 16px',
        fontSize: '20px',
        fontWeight: 900,
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 1.4,
        letterSpacing: 'normal',
        color: '#5b6c84',
    },
    SeparationLine: {
        height: '1px',
        border: 'solid 1px #dce0e8',
    },
    CurrentBalanceHeader: {
        margin: '14.5px 16px 20px 16px',
        fontSize: '14px',
        fontWeight: 'bold',
        lineHeight: '1.29',
        color: '#a1acbe',
    },
    ErrorMessageWrapper: {
        margin: '0px 16px 15.5px 16px',
    },
    CurrentBalance: {
        margin: '0px 3px 10px 16px',
        fontSize: '28px',
        fontWeight: 'bold',
        lineHeight: '0.82',
        letterSpacing: 'normal',
        color: '#2a323e',
    },
    CurrentBalanceLiquidated: {
        margin: '0px 3px 10px 16px',
        fontSize: '28px',
        fontWeight: 'bold',
        lineHeight: '0.82',
        letterSpacing: 'normal',
        color: '#ec1c26',
    },
    CurrentBalanceDollars: {
        margin: '0px 47px 15.5px 16px',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.43,
        color: '#5b6c84',
    },
    RemainingDaysNumber: {
        margin: '0px 6px 17.5px 16px',
        fontSize: '24px',
        fontWeight: 500,
        lineHeight: 0.96,
        color: '#2a323e',
    },
    RemainingDays: {
        marginLeft: '6px',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.43,
        color: '#5b6c84',
    },
    ActionButtonWrapper: {
        [screenSizes.xs]: {
            direction: 'row',
        },
    },
    ActionButton: {
        maxWidth: '144px',
        height: '48px',
        borderRadius: '6px',
        cursor: 'pointer',
        [screenSizes.lg]: {
            maxWidth: '340px',
        },
        [screenSizes.md]: {
            maxWidth: '340px',
        },
        [screenSizes.xs]: {
            display: 'block',
            maxWidth: '425px',
        },
    },
    ActionButtonLarge: {
        margin: '10px auto 0px !important',
        backgroundColor: 'red',
        maxWidth: '304px',
    },
    ActionButtonLiquidated: {
        maxWidth: '304px',
        height: '48px',
        borderRadius: '6px',
        cursor: 'pointer',
    },
}));