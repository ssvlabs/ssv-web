import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    Text: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.62,
        color: theme.colors.gray80,
        marginBottom: theme.spacing(2),
    },

    gridContainer: {
        flexGrow: 1,
        flexDirection: 'column',
    },
    bodyText: {
        fontWeight: 500,
        color: '#5B6C84',
        fontSize: '14px',
        fontStyle: 'normal',
    },
    guideStepsContainerPaper: {
        cursor: 'pointer',
        marginTop: '60px',
        border: '1px solid black',
        padding: theme.spacing(3.8),
        '&:hover': {
            backgroundColor: 'aliceblue',
        },
    },
    guideStepText: {
        fontSize: 14,
    },
    arrowIcon: {
        float: 'right',
        marginLeft: 'auto',
        alignSelf: 'center',
        marginTop: theme.spacing(0),
        marginRight: theme.spacing(1),
    },
    imageContainer: {
        width: '100%',
        height: '200px',
    },
    rhinoImage: {
        width: 180,
        height: 150,
        margin: 'auto',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        marginTop: theme.spacing(10),
        backgroundRepeat: 'no-repeat',
        marginBottom: theme.spacing(10),
        backgroundImage: 'url(/images/rhino/light.png)',
    },
}));
