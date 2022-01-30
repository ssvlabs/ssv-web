import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    gridWrapper: {
        width: 424,
        padding: 32,
        borderRadius: 16,
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: theme.colors.white,
    },
    DialogWrapper: {
        '& > div > div': {
            borderRadius: 16,
            backgroundColor: theme.colors.white,
        },
    },
    Loader: {
        width: 100,
        marginTop: 20,
        marginBottom: 40,
    },
    gridContainer: {
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
    transactionText: {
        '&::-webkit-scrollbar': {
            display: 'none',
        },
        overflow: 'scroll',
        textOverflow: 'clip',
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
    validatorText: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.14,
        textAlign: 'left',
        color: theme.colors.gray40,
        marginBottom: theme.spacing(2),
    },
    copyImage: {
        verticalAlign: 'middle',
        cursor: 'pointer',
    },
    connectButton: {
        padding: '10px',
        marginLeft: '5px',
        cursor: 'pointer',
        borderRadius: '10px',
        border: '1px solid black',
        backgroundColor: 'inherit',
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
