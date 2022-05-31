import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    GridItem: {
        height: 74,
        marginBottom: theme.spacing(5),
        '&:last-of-type': {
            marginBottom: 39,
        },
    },
    TextError: {
        color: 'red',
        zIndex: 9123123,
        fontSize: '0.8rem',
    },
}));
