import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    Wrapper: {
        gap: 10,
        borderRadius: 2,
        padding: '12px 16px',
        alignItems: 'center',
        color: theme.colors.black,
        justifyContent: 'flex-start',
        marginBottom: theme.spacing(5),
        border: `solid 1px ${theme.colors.primaryError}`,
        backgroundColor: theme.colors.primaryErrorRegular,
    },
}));
