import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    gridWrapper: {
        padding: '10px 25px 25px 25px',
        flexDirection: 'column',
        // width: '500px',
    },
    gridContainer: {
        marginBottom: '20px',
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
        borderRadius: '10px',
        margin: 'auto',
        flexGrow: 1,
        flexDirection: 'row',
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
        width: '50px',
        height: '40px',
        cursor: 'pointer',
        float: 'right',
    },
}));
