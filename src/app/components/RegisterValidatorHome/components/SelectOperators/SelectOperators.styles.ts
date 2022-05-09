import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    Container: {
        margin: 'auto',
        width: 'fit-content',
        marginTop: (props: any) => props.editPage ? 20 : '',
        '@media only screen and (max-width: 1400px)': {
            justifyContent: 'center',
            // flexDirection: 'column-reverse',
        },
    },
    FirstSquare: {
        width: 872,
        marginRight: 24,
        '@media only screen and (max-width: 1400px)': {
            width: 700,
            marginRight: 0,
        },
    },
    SecondSquare: {
        width: 424,
        '@media only screen and (max-width: 1400px)': {
            width: 700,
        },
    },
}));
