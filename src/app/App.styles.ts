import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    LoaderWrapper: {
        position: 'absolute',
        width: '200px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
}));