import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    ToolTipWrapper: {
        width: 14,
        height: 14,
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
        zIndex: 9999,
        fontSize: 14,
        minWidth: 350,
        fontWeight: 500,
        lineHeight: 1.62,
        textAlign: 'left',
        overflow: 'visible',
        borderRadius: '6px',
        position: 'absolute',
        color: theme.colors.white,
        transition: 'opacity 0.3s',
        backgroundColor: theme.colors.gray90,
        '& a': {
          color: theme.colors.primaryBlue,
        },
    },
}));