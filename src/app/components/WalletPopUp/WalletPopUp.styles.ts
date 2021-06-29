import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    gridWrapper: {
        width: '500px',
        padding: '40px',
        [theme.breakpoints.down('xs')]: {
          width: '350px',
            padding: '30px',
        },
    },
    gridContainer: {
        alignItems: 'center',
        flexGrow: 1,
        flexDirection: 'row',
    },
    header: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 800,
      fontSize: '20px',
    },
    gridContainerAddress: {
        border: '1px solid black',
    },
    connectButton: {
        cursor: 'pointer',
        backgroundColor: 'inherit',
        padding: '10px',
        borderRadius: '10px',
        border: '1px solid black',
    },
    gridItem: {
        padding: '5px',
        flexGrow: 1,
        flexDirection: 'column',
    },
    dialog: {
        flex: '0 0 auto',
        margin: '0px',
        padding: '0px',
    },
    accountAddress: {
        overflow: 'scroll',
        paddingLeft: '5px',
    },
    lunchIconWrapper: {
        textAlign: 'center',
        borderLeft: '1px solid black',
        minHeight: '35px',
        backgroundColor: '#F2F2F2',
        display: 'block',
        margin: 'auto',
        cursor: 'pointer',
    },
    launchIcon: {
      display: 'block',
      height: '35px',
      width: '25px',
      margin: 'auto',
    },
    exitIcon: {
        position: 'absolute',
        right: '20px',
        top: '20px',
        width: '25px',
        height: '25px',
        cursor: 'pointer',
        float: 'right',
    },
}));
