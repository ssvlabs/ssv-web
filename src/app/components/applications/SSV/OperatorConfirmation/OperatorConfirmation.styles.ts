import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    SubHeader: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.14,
        color: theme.colors.gray40,
        marginBottom: theme.spacing(2),
    },
    Section: {
        padding: theme.spacing(4, 8, 8, 8),
        height: 'fit-content',
        borderBottom: `solid 1px ${theme.colors.gray20}`,
        '&:nth-child(2)': {
            padding: theme.spacing(5, 8, 4, 8),
        },
        '&:nth-child(3)': {
            borderBottom: 'none',
        },
    },
    AlignRight: {
        textAlign: 'right',
    },
}));
