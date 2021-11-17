import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    button: {
        color: '#FFFFFF',
        cursor: 'pointer',
        height: '48px',
        background: '#5B6C84',
        borderRadius: '6px',
        width: '100%',
        textTransform: 'capitalize',
        '&:hover': {
            background: '#2a323e',
        },
    },
    ProgressStepsWrapper: {
        padding: '12px 23% 0px 23%',
        alignItems: 'center',
    },
    Step: {
        borderRadius: '50px',
        textAlign: 'center',
        border: 'solid 1px #5b6c84',
        width: '24px',
        height: '24px',
    },
    StepText: {
        margin: 'auto',
        width: '9px',
        paddingTop: '2px',
        height: '100%',
        fontSize: '12px',
        fontWeight: 'bold',
        lineHeight: 1.5,
        textAlign: 'center',
        color: '#a1acbe',
    },
    FinishText: {

    },
    Line: {
        height: '2px',
        verticalAlign: 'middle',
        backgroundColor: 'rgb(91, 108, 132)',
    },
    Checked: {
        width: '24px',
        height: '24px',
        backgroundColor: 'rgb(91, 108, 132)',
        borderRadius: '50px',
        fontWeight: 'bold',
        lineHeight: '1.5',
        color: 'rgb(161, 172, 190)',
    },
    Finish: {
        backgroundColor: '#20eec8',
        border: 'none',
    },
}));
