import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    wrapper: {
        backgroundColor: '#5B6C84',
        borderRadius: '4px',
        background: 'none',
        color: 'inherit',
        border: 'none',
        padding: 0,
        font: 'inherit',
        cursor: 'pointer',
        outline: 'inherit',
    },
    dataWrapper: {
      width: '97px',
      height: '24px',
      textAlign: 'center',
    },
    connectText: {
        padding: '0px',
        margin: '0px',
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '9px',
        lineHeight: '150%',
    },
}));
