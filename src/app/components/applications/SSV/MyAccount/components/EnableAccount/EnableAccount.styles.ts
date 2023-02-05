import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    Section: {
        padding: theme.spacing(4, 8, 4, 8),
        height: 'fit-content',
        borderBottom: `solid 1px ${theme.colors.gray20}`,
        '&:nth-child(2)': {
            padding: theme.spacing(5, 8, 4, 8),
        },
    },
    WarningWrapper: {
        fontSize: 14,
        fontWeight: 500,
        borderRadius: 2,
        lineHeight: 1.62,
        color: theme.colors.black,
        padding: theme.spacing(3, 4),
        marginBottom: theme.spacing(5),
        backgroundColor: 'rgba(255, 210, 10, 0.2)',
        border: `solid 1px ${theme.colors.primaryWarningRegular}`,
    },
    SummaryTitle: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.14,
        color: theme.colors.gray40,
        marginBottom: theme.spacing(4),
    },
    OperatorsTitle: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.14,
        color: theme.colors.gray40,
        marginBottom: theme.spacing(2),
    },
    ValidatorsDropDownWrapper: {
        gap: 24,
        maxHeight: 305,
        overflow: 'scroll',
    },
    SummaryField: {
        marginBottom: theme.spacing(2),
        justifyContent: 'space-between',
    },
    Text: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray90,
    },
    AlignRight: {
        textAlign: 'right',
        marginBottom: 24,
    },
}));
