import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Name: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray90,
    },
    Address: {
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: 1.5,
        color: 'rgb(161, 172, 190)',
    },
}));