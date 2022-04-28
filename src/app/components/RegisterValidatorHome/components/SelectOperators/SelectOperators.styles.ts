import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    Container: {
        width: 1320,
        margin: 'auto',
        marginTop: (props: any) => props.editPage ? 20 : '',
    },
    FirstSquare: {
        width: 872,
        marginRight: 24,
    },
    SecondSquare: {
        width: 424,
    },
}));
