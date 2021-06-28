import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    section: {
        '&:first-of-type': {
            marginBottom: '8px',
            fontFamily: 'Inter, sans-serif',
            fontStyle: 'normal',
            fontWeight: 'bold',
            color: '#A1ACBE',
        },
        '&:not(:first-of-type)': {
            marginBottom: '8px',
            fontFamily: 'Inter, sans-serif',
            fontStyle: 'normal',
            fontWeight: '500',
            color: '#5B6C84',
        },
    },
    dataValue: {
        textAlign: 'right',
    },
    total: {
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
        fontWeight: 900,
        color: '#20EEC8',
        fontSize: '18px',
    },
}));
