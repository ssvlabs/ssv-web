import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
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
}));
