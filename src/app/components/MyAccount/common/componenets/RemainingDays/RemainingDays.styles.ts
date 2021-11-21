import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    AmountOfDays: {
        marginTop: '16px',
        fontSize: '24px',
        fontWeight: 500,
        lineHeight: 1,
        textAlign: 'left',
        color: '#2a323e',
    },
    Days: {
        width: '34px',
        marginTop: '22px',
        marginLeft: '6px',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.43,
        color: '#5b6c84',
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
