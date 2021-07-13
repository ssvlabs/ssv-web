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
    toolbar: {
      height: '60px',
    },
    button: {
        textDecoration: 'none',
        color: 'white',
        cursor: 'pointer',
        fontFamily: 'Encode Sans',
        fontWeight: 'bold',
        userSelect: 'none',
        fontStyle: 'normal',
        fontSize: '12px',
        lineHeight: '150%',
        textTransform: 'uppercase',
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
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
    },
    menuIcon: {
        cursor: 'pointer',
        fontSize: '40px',
        marginTop: '5px',
    },
    menu: {
        verticalAlign: 'center',
        [theme.breakpoints.up('lg')]: {
            display: 'none',
        },
    },
    fullScreen: {
        color: 'white',
        position: 'absolute',
        backgroundColor: toolBarColor,
        height: '187px',
        width: '100%',
        textAlign: 'center',
        // paddingTop: '32px',
        zIndex: 1000,
    },
    menuButton: {
        fontWeight: 'bold',
        width: '100%',
        margin: 'auto',
        color: 'white',
        cursor: 'pointer',
        fontFamily: 'Encode Sans',
        userSelect: 'none',
        fontStyle: 'normal',
        fontSize: '12px',
        lineHeight: '150%',
        textTransform: 'uppercase',
    },
    menuButtonWrapper: {
        marginTop: '32px',
    },
}));
