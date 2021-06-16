import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    gridWrapper: {
        padding: '40px',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
    },
    gridContainer: {
        marginBottom: '40px',
        flexGrow: 1,
        flexDirection: 'row',
    },
    connectButton: {
        cursor: 'pointer',
        marginLeft: '5px',
        backgroundColor: 'inherit',
        padding: '10px',
        borderRadius: '10px',
        border: '1px solid black',
    },
    gridContainerAddress: {
        maxWidth: '100%',
        borderRadius: '10px',
        margin: 'auto',
        backgroundColor: '#F2F2F2',
    },
    dialogWrapper: {
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
    cursor: {
        cursor: 'pointer',
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
