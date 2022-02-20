import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Link: {
        cursor: 'pointer',
        display: 'inline-block',
        textDecoration: 'underline',
        color: theme.colors.primaryBlue,
    },
}));
