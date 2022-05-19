import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Text: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray60,
    },
    InputText: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.14,
        color: theme.colors.gray40,
    },
    InputWrapper: {
        gap: 8,
        marginTop: 32,
        justifyContent: 'space-between',
    },
    TextError: {
        color: 'red',
        marginTop: 4,
        zIndex: 9123123,
        fontSize: '0.8rem',
    },
}));
