import { makeStyles } from '@material-ui/core/styles';
import screenSizes from '~lib/utils/screenSizes';

export const useStyles = makeStyles((theme) => ({
    MyBalanceWrapper: {
        width: '424px',
        '@media (max-width: 1079px)': {
            width: '100%',
        },
        // padding: theme.spacing(0, 0, 8, 0),
        borderRadius: '8px',
        backgroundColor: theme.colors.squareScreenBackground,
        marginBottom: '20px',
    },
    SectionWrapper: {
        padding: theme.spacing(8),
    },
    Header: {
        width: '77px',
        height: '28px',
        fontSize: 20,
        fontWeight: 'bold',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 1.4,
        letterSpacing: 'normal',
        color: theme.colors.gray40,
        marginBottom: theme.spacing(5),
    },
    SeparationLine: {
        // height: '1px',
        border: `solid 1px ${theme.colors.gray20}`,
    },
    CurrentBalanceHeader: {
        fontSize: '14px',
        fontWeight: 'bold',
        lineHeight: '1.29',
        color: '#a1acbe',
    },
    ErrorMessageWrapper: {
        margin: '0px 16px 15.5px 16px',
    },
    CurrentBalance: {
        fontSize: 28,
        fontWeight: 800,
        lineHeight: 1.24,
        letterSpacing: -0.5,
        color: theme.colors.black,
        marginBottom: theme.spacing(1),
    },
    CurrentBalanceLiquidated: {
        fontSize: 28,
        fontWeight: 800,
        lineHeight: 0.82,
        color: '#ec1c26',
        letterSpacing: 'normal',
        marginBottom: theme.spacing(1),
    },
    CurrentBalanceDollars: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray40,
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
        padding: theme.spacing(8),
    },
    ActionButton: {
        height: 60,
        width: 168,
        fontSize: 16,
        maxWidth: 168,
        fontWeight: 600,
        borderRadius: 8,
        cursor: 'pointer',
        textAlign: 'center',
        alignItems: 'center',
        color: theme.colors.white,
        backgroundColor: theme.colors.primaryBlue,
        padding: theme.spacing(5, 13.75, 5, 13.25),
        '&:nth-of-type(2)': {
            marginLeft: theme.spacing(6),
            color: theme.colors.primaryBlue,
            padding: theme.spacing(5, 12, 5, 11.5),
            backgroundColor: theme.colors.tint90,
        },
        // [screenSizes.lg]: {
        //     maxWidth: '340px',
        // },
        // [screenSizes.md]: {
        //     maxWidth: '340px',
        // },
        // [screenSizes.xs]: {
        //     display: 'block',
        //     maxWidth: '425px',
        // },
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