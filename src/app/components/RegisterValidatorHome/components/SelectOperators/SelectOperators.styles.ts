import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    Container: {
        marginTop: (props: any) => props.editPage ? 20 : '',
        width: 1320,
        margin: 'auto',
    },
    FirstSquare: {
        width: 872,
        marginRight: 24,
    },
    SecondSquare: {
        width: 424,

    },
}));
