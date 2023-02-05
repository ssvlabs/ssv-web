import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    Image: {
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: (props: any) => props.width ? props.width : '',
        height: (props: any) => props.height ? props.height : '',
        backgroundImage: (props: any) => `url(/images/${props.image}/${theme.darkMode ? 'dark' : 'light'}.svg)`,
    },
}));
