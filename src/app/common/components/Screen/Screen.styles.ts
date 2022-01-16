import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    root: {
    },
    align: {
        textAlign: 'center',
    },
    navigation: {
        height: '20px',
        marginTop: '54px',
        '@media (max-width: 480px)': {
            marginTop: '28px',
        },
    },
    header: {
       marginTop: '23px',
    },
    body: {
    },
}));
