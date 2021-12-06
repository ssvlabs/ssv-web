import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Wrapper: {
        marginBottom: theme.spacing(2),
    },
    Text: {
        height: 16,
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.14,
        color: theme.colors.gray40,
        marginRight: theme.spacing(2),
    },
}));
