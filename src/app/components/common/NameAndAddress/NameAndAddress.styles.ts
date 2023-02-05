import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    Name: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray90,
    },
    Address: {
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.5,
        color: 'rgb(161, 172, 190)',
    },
}));