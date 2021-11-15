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
            background: '#2A323E',
        },
    },
    ProgressStepsWrapper: {
        padding: '23px 20% 0px 20%',
        alignItems: 'center',
    },
    Step: {
        width: '24px',
        height: '24px',
        padding: '2px 8px',
        border: 'solid 1px rgb(91, 108, 132)',
        borderRadius: '50px',
        textAlign: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        lineHeight: '1.5',
        color: '#a1acbe',
    },
    Line: {
        height: '1px',
        verticalAlign: 'middle',
        backgroundColor: 'rgb(91, 108, 132)',
    },
    Checked: {
        width: '24px',
        height: '24px',
        padding: '3px 8px 3px 7px',
        backgroundColor: 'rgb(91, 108, 132)',
        borderRadius: '50px',
        textAlign: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        lineHeight: '1.5',
        color: 'rgb(161, 172, 190)',
    },
    Finish: {
        backgroundColor: '#20eec8',
    },
}));
