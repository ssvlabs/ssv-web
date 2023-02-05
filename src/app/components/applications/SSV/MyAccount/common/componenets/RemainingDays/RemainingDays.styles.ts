import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    AmountOfDaysText: {
        fontSize: 16,
        lineHeight: 1.62,
        fontWeight: 'bold',
        color: theme.colors.gray40,
        marginBottom: theme.spacing(2),
    },
    Hint: {
        alignSelf: 'center',
        marginLeft: 8,
        marginBottom: 8,
    },
    Red: {
        color: '#ec1c26',
    },

    Wrapper: {
        
    },
    AmountOfDays: {
        fontSize: 24,
        fontWeight: 500,
        lineHeight: 1.24,
        textAlign: 'left',
        color: (props: any) => { return props.warningLiquidationState ? 'red' : theme.colors.black; },
    },
    Days: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1.5),
        color: (props: any) => { return props.warningLiquidationState ? 'red' : theme.colors.gray40; },
    },
    NewDaysEstimation: {
        marginTop: 10,
        marginLeft: 10,
        lineHeight: 1.2,
        fontSize: '20px',
        fontWeight: 'normal',
        color: (props: any) => { return props.warningLiquidationState || props.withdrawState ? 'red' : theme.colors.primarySuccessDark; },
    },
}));
