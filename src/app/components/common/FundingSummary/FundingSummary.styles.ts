import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    Text: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        marginBottom: 24,
        color: theme.colors.gray80,
    },
    Link: {
        fontSize: 14,
        cursor: 'pointer',
        textDecoration: 'underline',
        color: theme.colors.primaryBlue,
    },
    GreyHeader: {
        fontSize: 14,
        marginTop: 4,
        marginBottom: 8,
        lineHeight: 1.14,
        fontWeight: 500,
        color: theme.colors.gray40,
    },
    BigGreyHeader: {
        fontSize: 14,
        marginTop: 4,
        marginBottom: 8,
        lineHeight: 1.14,
        fontWeight: 600,
        color: theme.colors.gray40,
    },
    BiggerFont: {
        fontSize: 16,
    },
}));
