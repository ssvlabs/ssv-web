import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    PrimaryButton: {
        height: 60,
        fontSize: 16,
        width: '100%',
        fontWeight: 600,
        borderRadius: 8,
        textTransform: 'none',
        fontFamily: 'Manrope !important',
        border: (props: any) => props.errorButton && theme.darkMode ? `1px solid ${theme.colors.primaryError}` : '',
        color: (props: any) => props.errorButton ? theme.colors.primaryError : theme.colors.white,
        backgroundColor: (props: any) => {
            if (props.errorButton && theme.darkMode) return 'transparent';
            if (props.errorButton) return theme.colors.primaryErrorRegular;
            return theme.colors.primaryBlue;
        },
        '&:hover': {
            backgroundColor: (props: any) => props.errorButton ? theme.colors.primaryErrorRegular : theme.colors.shade20,
        },
        '&:active': {
            backgroundColor: theme.colors.shade40,
        },
        '&:disabled': {
            border: 'none',
            color: theme.colors.gray40,
            backgroundColor: theme.colors.gray20,
        },
    },
    Loading: {
        height: 60,
        width: '100%',
        fontWeight: 600,
        borderRadius: 8,
        textTransform: 'capitalize',
        fontFamily: 'Manrope !important',
        color: (props: any) => props.errorButton ? theme.colors.primaryError : theme.colors.tint20,
        backgroundColor: (props: any) => props.errorButton ? theme.colors.primaryErrorRegular : theme.colors.tint80,
        '&:hover': {
            backgroundColor: (props: any) => props.errorButton ? '' : theme.colors.tint80,
        },
        '&:focus': {
            backgroundColor: theme.colors.tint80,
        },
        '&:disabled': {
            color: (props: any) => props.errorButton ? theme.colors.primaryError : theme.colors.tint20,
            backgroundColor: (props: any) => props.errorButton ? theme.colors.primaryErrorRegular : theme.colors.tint80,
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