import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    LoaderWrapper: {
        width: '100%',
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        zIndex: 9999,
        flexGrow: 1,
        flexDirection: 'column',
        alignContent: 'center',
        alignItems: 'center',
    },
    Loader: {
        position: 'absolute',
        width: '200px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
}));