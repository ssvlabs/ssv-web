import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => {
    return {
        LoaderWrapper: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            flexGrow: 1,
            width: '100%',
            display: 'flex',
            position: 'fixed',
            alignItems: 'center',
            alignContent: 'center',
            flexDirection: 'column',
            zIndex: 999999,
            backgroundColor: theme.darkMode ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)',
        },
        Loader: {
            position: 'absolute',
            width: '200px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        },
    };
});