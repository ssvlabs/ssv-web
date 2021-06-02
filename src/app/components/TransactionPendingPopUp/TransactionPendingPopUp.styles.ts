import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    gridWrapper: {
        margin: 'auto',
        padding: '20px',
        textAlign: 'center',
        marginBottom: '20px',
        flexGrow: 1,
        flexDirection: 'column',
    },
    gridContainer: {
        width: '90%',
        margin: 'auto',
        padding: '5px',
        textAlign: 'center',
        marginBottom: '20px',
        flexGrow: 1,
        flexDirection: 'row',
    },
    transactionContainer: {
        border: '1px solid black',
        width: '90%',
    },
    title: {
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    subTitle: {
        fontSize: '13px',
    },
    loaderWrapper: {
        width: '20%',
        marginBottom: '50px',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    loader: {
        height: '10px',
        width: '10px',
        borderRadius: '50%',
        backgroundColor: '#454545',
        animation: '$scaling 2.5s ease-in-out infinite',
        '&:nth-child(1)': {
          animationDelay: '0s',
        },
        '&:nth-child(2)': {
            animationDelay: '0.2s',
        },
        '&:nth-child(3)': {
            animationDelay: '0.4s',
        },
    },
    '@keyframes scaling': {
        '0%, 100%': {
            transform: 'scale(0.2)',
        },
        '50%': {
            transform: 'scale(1)',
        },
    },
    copyImage: {
        verticalAlign: 'middle',
        cursor: 'pointer',
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
        padding: '20px',
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
    exitIcon: {
        width: '50px',
        height: '40px',
        cursor: 'pointer',
        float: 'right',
    },
}));
