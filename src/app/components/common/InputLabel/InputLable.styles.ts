import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
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
    AdditionalLabel: {
        fontSize: 14,
        color: theme.colors.gray30,
    },
}));
