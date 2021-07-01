import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    mainContainer: {
        height: '100%',
        width: 500,
        maxWidth: '100%',
        padding: theme.spacing(2),
        alignItems: 'center',
        alignContent: 'center',
        margin: 'auto',
        flexDirection: 'row',
    },
    successIcon: {
        width: '80px',
    },
    title: {
        fontWeight: 'bold',
    },
    congratsImage: {
        width: '100px',
    },
    subTitle: {
        width: '90%',
        textAlign: 'center',
        margin: 'auto',
    },
    guideStepText: {
        fontSize: 14,
    },
    guideStepsContainerPaper: {
        cursor: 'pointer',
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
        '&:hover': {
            backgroundColor: 'aliceblue',
        },
        maxWidth: '100%',
    },
    gridContainer: {
        flexGrow: 1,
        flexDirection: 'row',
    },
    successImage: {
      marginTop: '10px',
    },
    linkWrapper: {
      marginTop: '40px',
    },
    icon: {
      width: '100%',
    },
    arrowIcon: {
        float: 'right',
        marginLeft: 'auto',
        marginRight: theme.spacing(1),
        alignSelf: 'center',
        marginTop: theme.spacing(1),
    },
}));
