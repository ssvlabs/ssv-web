import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    root: {
        fontFamily: 'Encode Sans',
        marginTop: 15,
        padding: 30,
        border: '1px solid #5B6C84',
        borderRadius: 6,
    },
    align: {
        textAlign: 'center',
    },
    navigation: {
        height: '20px',
        '@media (max-width: 480px)': {
            marginTop: '28px',
        },
    },
    header: {
       marginTop: '23px',
        textAlign: 'center',
    },
    body: {
    },
}));
