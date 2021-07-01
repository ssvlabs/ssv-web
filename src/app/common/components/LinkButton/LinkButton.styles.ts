import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    guideStepsContainerPaper: {
        cursor: 'pointer',
        height: '79px',
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
    gridWrapper: {
      height: '100%',
    },
    textWrapper: {
        marginLeft: '16px',
        '@media (max-width: 480px)': {
            marginLeft: '10px',
        },
        display: 'flex',
        alignItems: 'center',
    },
    guideStepText: {
        fontFamily: 'Encode Sans',
        fontStyle: 'normal',
        fontWeight: 900,
        fontSize: '18px',
        color: '#5B6C84',
    },
    guideStepSubText: {
        fontFamily: 'Encode Sans',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
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
    },
    arrowIconWrapper: {
        display: 'flex',
    },
    arrowIcon: {
      width: '16px',
    },
}));
