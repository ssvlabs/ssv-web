import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    PrimaryButton: {
        height: 60,
        width: '100%',
        fontWeight: 600,
        borderRadius: 8,
        marginBottom: 16,
        color: theme.colors.white,
        textTransform: 'capitalize',
        fontFamily: 'Manrope !important',
        backgroundColor: theme.colors.primaryBlue,
        '&:hover': {
            backgroundColor: theme.colors.shade20,
        },
        '&:focus': {
            backgroundColor: theme.colors.shade40,
        },
        '&:disabled': {
            color: theme.colors.gray40,
            backgroundColor: theme.colors.gray20,
        },
    },
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
    Checkbox: {
        margin: 'auto',
        width: '10px',
        height: '10px',
        backgroundColor: 'red',
    },
    Agreement: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: 'red',
    },
}));