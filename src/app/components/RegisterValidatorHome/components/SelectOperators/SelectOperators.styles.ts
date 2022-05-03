import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Container: {
        margin: 'auto',
        width: 'fit-content',
        marginTop: (props: any) => props.editPage ? 20 : '',
        '@media only screen and (max-width: 1400px)': {
            height: 40,
            width: 28.5,
            backgroundImage: `url(/images/logo/${theme.darkMode ? 'small_light' : 'small_light'}.svg)`,
        },
    },
    FirstSquare: {
        width: 872,
        marginRight: 24,
    },
    SecondSquare: {
        width: 424,
    },
}));
