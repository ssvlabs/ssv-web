import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    LoaderWrapper: {
        width: '100%',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'left',
        alignContent: 'center',
        flexDirection: 'column',
    },
    Loader: {
        width: '36px',
        marginLeft: theme.spacing(2),
    },
}));
