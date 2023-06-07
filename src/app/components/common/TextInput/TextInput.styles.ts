import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

const conditionalBackgroundColor = (theme: Theme, props: any) => {
    if (props.disable) {
        return theme.colors.gray20;
    }
    return theme.colors.white;
};

const conditionalBorder = (theme: any, props: any) => {
    if (props.showError) {
        return '1px solid red !important';
    }
    if (props.disable) {
        return `solid 1px ${theme.colors.gray30}`;
    }

    return `solid 1px ${theme.colors.gray30}`;
};

export const useStyles = makeStyles((theme: Theme) => ({
    Wrapper: {
        height: 50,
        fontSize: 16,
        width: '100%',
        fontWeight: 500,
        borderRadius: 8,
        lineHeight: 1.62,
        color: theme.colors.black,
        padding: theme.spacing(3, 5),
        border: (props: any) => conditionalBorder(theme, props),
        backgroundColor: (props: any) => conditionalBackgroundColor(theme, props),
    },
    Input: {
        fontSize: 16,
        width: '100%',
        fontWeight: 500,
        lineHeight: 1.62,
        border: 'none !important',
        color: theme.colors.gray90,
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
    Lock: {
        width: 24,
        height: 24,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        marginRight: theme.spacing(3),
        backgroundImage: `url(/images/lock/active_${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
    LockDisable: {
        cursor: 'not-allowed',
        backgroundImage: `url(/images/lock/disable_${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
    Text: {
        fontSize: 16,
        fontWeight: 500,
        paddingLeft: 20,
        lineHeight: 1.62,
    },
    Icon: {
        alignSelf: 'center',
    },
}));
