import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Balance: {
        width: 78,
        height: 26,
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray90,
    },
    BoldBalance: {
        width: 78,
        height: 28,
        fontSize: 20,
        fontWeight: 'bold',
        lineHeight: 1.4,
        color: theme.colors.gray90,
    },
    DollarBalance: {
        width: 69,
        height: 23,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray40,
    },
}));