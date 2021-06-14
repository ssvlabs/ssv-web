import { makeStyles } from '@material-ui/core/styles';

const toolBarColor = '#323232';

export const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: toolBarColor,
        flexGrow: 1,
    },
    bloxColor: {
        backgroundColor: toolBarColor,
    },
    firstSection: {
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '30%',
    },
    secondSection: {
        width: '68%',
        alignItems: 'flex-end',
    },
    menuIcon: {
        cursor: 'pointer',
        height: '24px',
    },
    walletButton: {
    },
    menu: {
        [theme.breakpoints.up('lg')]: {
            display: 'none',
        },
    },
    button: {
        textDecoration: 'none',
        color: 'white',
        cursor: 'pointer',
        userSelect: 'none',
        '&:first-child': {
            fontWeight: 'bolder',
        },
        [theme.breakpoints.down('md')]: {
            '&:not(:first-child)': {
                display: 'none',
            },
        },
    },
    title: {
        flexGrow: 1,
        flexDirection: 'row',
    },
    fullScreen: {
        color: 'white',
        position: 'absolute',
        backgroundColor: toolBarColor,
        height: '100%',
        width: '100%',
        textAlign: 'center',
        padding: '20%',
    },
    menuDropDown: {
        height: '70%',
    },
    menuButton: {
        fontWeight: 'bold',
        width: '100%',
        margin: 'auto',
    },
}));
