import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    gridContainer: {
        flexGrow: 1,
        flexDirection: 'column',
    },
    bodyText: {
      fontSize: '14px',
      color: '#5B6C84',
      fontStyle: 'normal',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
    },
    guideStepsContainerPaper: {
        cursor: 'pointer',
        border: '1px solid black',
        marginTop: '60px',
        // margin: `${theme.spacing(1)}px auto`,
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
        marginRight: theme.spacing(1),
        alignSelf: 'center',
        marginTop: theme.spacing(0),
    },
    imageContainer: {
        height: '200px',
        width: '100%',
    },
    rhinoImage: {
        float: 'right',
        width: '125px',
        /*  display: 'block',
          float: 'right',
          position: 'relative',
          [theme.breakpoints.down('xl')]: {
              top: '60px',
          }, */
        // right: '1px',
        // bottom: '1px',
    },
}));
