import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    mainContainer: {
        height: '100%',
        width: '100%',
        padding: theme.spacing(4),
    },
    gridContainer: {
        flexGrow: 1,
        flexDirection: 'column',
    },
}));
