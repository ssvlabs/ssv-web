import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    mainContainer: {
        height: '100%',
        width: '100%',
        padding: theme.spacing(4),
    },
    guideStepsContainerPaper: {
        cursor: 'pointer',
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
        '&:hover': {
            backgroundColor: 'aliceblue',
        },
    },
    gridContainer: {
        flexGrow: 1,
        flexDirection: 'column',
    },
    guideStep: {
        marginBottom: theme.spacing(1),
    },
    arrowIcon: {
        float: 'right',
        marginLeft: 'auto',
        marginRight: theme.spacing(1),
        alignSelf: 'center',
        marginTop: theme.spacing(1.5),
    },
}));
