import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles(() => ({
    gridContainer: {
        padding: '20px',
        flexDirection: 'row',
        textAlign: 'center',
    },
    title: {
        fontWeight: 'bolder',
        marginBottom: '20px',
    },
    exitIcon: {
        width: '50px',
        height: '40px',
        cursor: 'pointer',
        float: 'right',
    },
}));
