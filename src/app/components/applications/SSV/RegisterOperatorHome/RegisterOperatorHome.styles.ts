import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    LinkButtonWrapper: {
        width: 280,
        display: 'flex',
        cursor: 'pointer',
        textAlign: 'center',
        alignItems: 'center',
        '&:nth-of-type(1)': {
            marginRight: '20px',
        },
    },
    UnderButtonText: {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.62,
        textAlign: 'center',
        color: theme.colors.gray40,
        marginTop: theme.spacing(2),
    },
}));
