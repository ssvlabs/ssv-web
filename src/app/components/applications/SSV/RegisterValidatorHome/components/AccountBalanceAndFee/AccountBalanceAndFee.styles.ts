import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    bodyTextWrapper: {
        marginBottom: 16,
    },
    bodyText: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray80,
    },
    ErrorTextWrapper: {
        height: 93,
        borderRadius: 2,
        padding: theme.spacing(3, 4),
        marginBottom: theme.spacing(5),
        backgroundColor: 'rgba(236, 28, 38, 0.08)',
        border: `solid 1px ${theme.colors.primaryError}`,
    },
    ErrorText: {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray90,
    },
}));
