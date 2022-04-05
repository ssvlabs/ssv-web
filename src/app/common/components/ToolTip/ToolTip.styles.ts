import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    ToolTipWrapper: {
        width: 14,
        height: 14,
        marginLeft: 10,
        cursor: 'pointer',
        position: 'relative',
        verticalAlign: 'middle',
        display: 'inline-block',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(/images/hint/${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
    // ToolTip: {
    //     width: 16,
    //     height: 16,
    //     verticalAlign: 'middle',
    // },
    toolTipText: {
        top: 15,
        left: -170,
        padding: 10,
        fontSize: 14,
        minWidth: 350,
        fontWeight: 500,
        lineHeight: 1.62,
        zIndex: 9999999,
        textAlign: 'center',
        borderRadius: '6px',
        position: 'absolute',
        transition: 'opacity 0.3s',
        backgroundColor: theme.colors.gray90,
        color: `${theme.colors.white} !important`,
        '& a': {
          color: theme.colors.primaryBlue,
        },
    },
}));