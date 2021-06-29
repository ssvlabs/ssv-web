import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    guideStepsContainerPaper: {
        cursor: 'pointer',
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2) - 4,
        border: '2px solid transparent',
        '&:hover': {
            borderSizing: 'border-box',
            border: '2px solid #20EEC8',
        },
        boxShadow: '0px 5px 13px rgba(91, 108, 132, 0.16)',
        borderRadius: '6px',
    },
    textWrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    guideStepText: {
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
        fontWeight: 900,
        fontSize: '18px',
        color: '#5B6C84',
        [theme.breakpoints.down('md')]: {
          fontSize: '14px',
        },
    },
    guideStepSubText: {
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        [theme.breakpoints.down('md')]: {
            fontSize: '12px',
        },
        color: '#A1ACBE',
    },
    iconWrapper: {
        display: 'flex',
    },
    icon: {
        display: 'block',
        width: '50px',
        height: '50px',
        margin: 'auto',
        float: 'left',
    },
    arrowIcon: {
        float: 'right',
        color: '#20EEC8',
        height: '100%',
    },
}));
