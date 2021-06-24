import { makeStyles } from '@material-ui/core/styles';

const toolBarColor = '#A1ACBE';

export const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: toolBarColor,
        flexGrow: 1,
        alignItems: 'center',

    },
    bloxColor: {
        backgroundColor: toolBarColor,
    },
    button: {
        textDecoration: 'none',
        color: 'white',
        cursor: 'pointer',
        fontFamily: 'Encode Sans',
        fontWeight: 'bold',
        userSelect: 'none',
        [theme.breakpoints.down('md')]: {
                display: 'none',
        },
    },
    mainButton: {
        textDecoration: 'none',
        color: 'white',
        cursor: 'pointer',
        userSelect: 'none',
        fontFamily: 'Fira Code',
    },
    menuIcon: {
        cursor: 'pointer',
        fontSize: '36px',
        [theme.breakpoints.down('md')]: {
            fontSize: '28px',
        },
    },
    menu: {
        alignSelf: 'center',
        [theme.breakpoints.up('lg')]: {
            display: 'none',
        },
    },
    fullScreen: {
        color: 'white',
        position: 'absolute',
        backgroundColor: toolBarColor,
        height: '100%',
        width: '100%',
        textAlign: 'center',
        padding: '20%',
        zIndex: 1000,
    },
    menuDropDown: {
        height: '40%',
    },
    menuButton: {
        fontWeight: 'bold',
        width: '100%',
        margin: 'auto',
    },
}));
