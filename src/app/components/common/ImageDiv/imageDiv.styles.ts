import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
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
