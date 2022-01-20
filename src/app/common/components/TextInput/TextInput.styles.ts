import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Wrapper: {
        height: 50,
        fontSize: 16,
        width: '100%',
        fontWeight: 500,
        borderRadius: 8,
        lineHeight: 1.62,
        color: theme.colors.black,
        padding: theme.spacing(3, 5),
        backgroundColor: theme.colors.white,
        border: `solid 1px ${theme.colors.gray30}`,
    },
    InputWrapper: {
        width: '90%',
    },
    Input: {
        fontSize: 16,
        width: '100%',
        fontWeight: 500,
        border: 'none !important',
        color: theme.colors.black,
        backgroundColor: 'transparent',
    },
    FullInput: {
        width: '100%',
        borderRadius: 8,
        border: `solid 1px ${theme.colors.gray30}`,
    },
    disable: {
        backgroundColor: theme.colors.gray20,
        border: `solid 1px ${theme.colors.gray30}`,
    },
    Error: {
        border: '1px solid red !important',
    },
    Lock: {
        width: 24,
        height: 24,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        marginRight: theme.spacing(3),
        backgroundImage: 'url(/images/lock/active.svg)',
    },
    LockDisable: {
        cursor: 'not-allowed',
        backgroundImage: 'url(/images/lock/disable.svg)',
    },
    Text: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
    },
}));
