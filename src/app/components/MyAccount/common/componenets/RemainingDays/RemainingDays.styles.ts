import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    AmountOfDays: {
        fontSize: 24,
        fontWeight: 500,
        lineHeight: 1.24,
        color: theme.colors.black,
        textAlign: 'left',
    },
    AmountOfDaysText: {
        fontSize: 16,
        lineHeight: 1.62,
        fontWeight: 'bold',
        color: theme.colors.gray40,
        marginBottom: theme.spacing(2),
    },
    Days: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray40,
        marginTop: theme.spacing(1.5),
        marginLeft: theme.spacing(1),
    },
    NewDaysEstimation: {
        marginTop: '18px',
        fontSize: '20px',
        fontWeight: 'normal',
        lineHeight: 1.2,
        color: '#06b64f',
        marginLeft: '10px',
    },
    Red: {
        color: '#ec1c26',
    },
}));
