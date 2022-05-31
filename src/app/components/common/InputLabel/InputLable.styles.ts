import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Wrapper: {
        alignItems: 'center',
        marginBottom: theme.spacing(2),
    },
    Text: {
        fontSize: 14,
        marginRight: 8,
        fontWeight: 600,
        lineHeight: 1.14,
        color: theme.colors.gray40,
    },
}));
