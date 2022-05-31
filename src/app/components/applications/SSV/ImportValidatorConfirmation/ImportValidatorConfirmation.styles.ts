import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    SubHeader: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.14,
        color: theme.colors.gray40,
        marginBottom: theme.spacing(2),
    },
    RowWrapper: {
        marginTop: theme.spacing(5),
    },
    Row: {
        marginBottom: theme.spacing(2),
        '&:last-child': {
            marginBottom: theme.spacing(0),
        },
    },
    AlignRight: {
        textAlign: 'right',
    },
    Section: {
        height: 'fit-content',
        padding: theme.spacing(5, 8, 8, 8),
        borderBottom: `solid 1px ${theme.colors.gray20}`,
        '&:nth-child(3)': {
            padding: theme.spacing(5, 8, 8, 8),
        },
        '&:last-child': {
            border: 'none',
        },
    },
    InsufficientBalanceWrapper: {
        fontSize: 14,
        fontWeight: 500,
        borderRadius: 2,
        lineHeight: 1.62,
        color: theme.colors.gray90,
        marginTop: theme.spacing(5),
        padding: theme.spacing(3, 4),
        marginBottom: theme.spacing(5),
        border: `solid 1px ${theme.colors.primaryError}`,
        backgroundColor: theme.colors.primaryErrorRegular,
    },
}));
