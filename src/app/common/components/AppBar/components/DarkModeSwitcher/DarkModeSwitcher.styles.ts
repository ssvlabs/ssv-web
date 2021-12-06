import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Image: {
        width: 44,
        height: 28,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        margin: theme.spacing(0, 6, 0, 6),
        // transition: 'background-image 0.1s ease-in-out',
        backgroundImage: (props: any) => `url(/images/toggle/${props.isDarkMode ? 'dark' : 'light'}.svg)`,

    },
}));
