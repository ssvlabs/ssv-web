import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    gridWrapper: {
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
        color: '#20EEC8',
        fontWeight: 800,
        fontSize: '20px',
    },
    gridContainerAddress: {
        borderRadius: '6px',
        border: '1px solid black',
    },
    connectButton: {
        cursor: 'pointer',
        backgroundColor: 'inherit',
        padding: '10px',
        border: '1px solid #5B6C84',
        borderRadius: '6px',
        '&:hover': {
          backgroundColor: 'rgba(220, 224, 232, 0.5)',
        },
    },
    gridItem: {
        padding: '5px',
        flexGrow: 1,
        flexDirection: 'column',
    },
    dialog: {
        flex: '0 0 auto',
        margin: '0px',
        padding: '40px',
        '@media (max-width: 480px)': {
            padding: '10px',
        },
    },
    accountAddress: {
        '&::-webkit-scrollbar': {
            display: 'none',
        },
        overflow: 'scroll',
        paddingLeft: '5px',
    },
    lunchIconWrapper: {
        textAlign: 'center',
        borderLeft: '1px solid black',
        borderRadius: '0px 6px 6px 0px',
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
