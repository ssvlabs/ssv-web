import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import screenSizes from '~lib/utils/screenSizes';

const warningRunWayStates = {
    gap: 10,
    height: 26,
    fontSize: 14,
    borderRadius: 4,
    fontWeight: 500,
    lineHeight: 1.62,
    padding: '1px 6px',
    alignItems: 'center',
    justifyContent: 'center',
};

export const useStyles = makeStyles((theme: Theme) => ({
    MyBalanceWrapper: {
        width: '424px',
        '@media (max-width: 1200px)': {
            width: '100%',
        },
        borderRadius: 16,
        marginBottom: 20,
        backgroundColor: theme.colors.squareScreenBackground,
    },
    SectionWrapper: {
        padding: theme.spacing(8),
    },
    SecondSectionWrapper: {
        padding: theme.spacing(3, 8, 8, 8),
    },
    Liquidated: {
        width: 82,
        ...warningRunWayStates,
        color: theme.colors.primaryError,
        backgroundColor: 'rgba(236, 28, 38, 0.03)',
    },
    LowRunWay: {
        width: 93,
        ...warningRunWayStates,
        color: theme.colors.primaryError,
        backgroundColor: 'rgba(253, 218, 72, 0.2)',
    },
    Header: {
        gap: 16,
        fontSize: 20,
        width: '77px',
        height: '28px',
        lineHeight: 1.4,
        fontWeight: 'bold',
        fontStyle: 'normal',
        alignItems: 'center',
        fontStretch: 'normal',
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
        // margin: '0px 16px 15.5px 16px',
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
        gap: 24,
        [screenSizes.xs]: {
            direction: 'row',
        },
        padding: theme.spacing(8),
    },
}));