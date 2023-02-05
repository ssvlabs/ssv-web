import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    SubHeaderWrapper: {
        gap: 8,
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        paddingBottom: 30,
        color: theme.colors.gray90,
    },
}));
