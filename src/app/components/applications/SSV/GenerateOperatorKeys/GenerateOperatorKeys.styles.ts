import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    GridItem: {
        height: 74,
        marginBottom: theme.spacing(5),
        '&:last-of-type': {
            marginBottom: 39,
        },
    },
    TextError: {
        color: 'red !important',
        zIndex: 9123123,
        fontSize: '0.8rem',
        '& p': {
            zIndex: 9123123,
            cursor: 'pointer',
            fontSize: '0.8rem',
            color: 'red !important',
        },
    },
}));
