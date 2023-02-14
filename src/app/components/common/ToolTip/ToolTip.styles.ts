import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

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
}));