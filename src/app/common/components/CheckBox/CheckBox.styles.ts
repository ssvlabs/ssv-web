import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    CheckBoxWrapper: {
        cursor: 'pointer',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: '12px',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.43,
        color: '#5b6c84',
    },
    BoxWrapper: {
        border: '1px solid #5b6c84',
        width: '16px',
        height: '16px',
        padding: '2px',
        marginLeft: '11px',
        marginRight: '11px',
    },
    Checkbox: {
        backgroundColor: '#5b6c84',
        margin: 'auto',
        width: '10px',
        height: '10px',
    },
}));
