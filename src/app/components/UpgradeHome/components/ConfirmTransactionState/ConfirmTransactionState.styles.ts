import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    root: {
        margin: 'auto',
        display: 'inline-flex',
        maxWidth: '100%',
    },
    formControl: {
        width: 440,
        maxWidth: '100%',
        margin: 'auto',
        display: 'flex',
    },
}));
