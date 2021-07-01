import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    validatorTextWrapper: {
        marginBottom: '20px',
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
}));
