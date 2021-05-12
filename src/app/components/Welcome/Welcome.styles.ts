import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    mainContainer: {
        height: '100%',
        width: 500,
        maxWidth: '100%',
        minHeight: 600,
        padding: theme.spacing(4),
        alignItems: 'center',
        alignContent: 'center',
        margin: 'auto',
        flexDirection: 'row',
    },
    inputWithHint: {
        backgroundColor: 'red',
        display: 'flex',
    },
    inputError: {
        border: '1px solid red',
    },
    textError: {
        fontSize: '0.8rem',
        color: 'red',
    },
    privateKeyTextInput: {
        marginBottom: '10px',
    },
    doneIcon: {
      color: 'green',
      float: 'left',
    },
    fileNameText: {
        textAlign: 'left',
    },
    clearIcon: {
        float: 'right',
    },
    fileContainer: {
        display: 'flex',
        padding: '10px',
        textAlign: 'center',
        alignItems: 'center',
        width: '100%',
        alignContent: 'center',
        height: '50px',
        border: 'dashed thin gray',
    },
    guideStepsContainerPaper: {
        cursor: 'pointer',
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
        '&:hover': {
            backgroundColor: 'aliceblue',
        },
    },
    bigSquareButton: {
        minHeight: 150,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        alignContent: 'center',
        alignItems: 'center',
    },
    bigSquareButtonGrid: {
        margin: 'auto',
        textAlign: 'center',
    },
    bigSquareButtonIcon: {
        width: 30,
        height: 30,
        maxWidth: 30,
        maxHeight: 30,
        margin: 'auto',
    },
    gridContainer: {
        flexGrow: 1,
        flexDirection: 'column',
        paddingTop: 10,
    },
    rowGridContainer: {
        flexGrow: 1,
        flexDirection: 'row',
    },
    guideStep: {
        marginBottom: theme.spacing(1),
    },
    guideStepText: {
        fontSize: 14,
    },
    arrowIcon: {
        float: 'right',
        marginLeft: 'auto',
        marginRight: theme.spacing(1),
        alignSelf: 'center',
        marginTop: theme.spacing(1),
    },
}));
