import { makeStyles } from '@material-ui/core/styles';

// const toolBarColor = '#A1ACBE';

export const useStyles = makeStyles((theme) => ({
    AppBarWrapper: {
        height: 80,
        padding: theme.spacing(4, 0, 4, 6),
        alignItems: 'center',
    },
    AppBarIcon: {
        height: 48,
        width: 160.2,
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(/images/logo/${theme.darkMode ? 'light' : 'dark'}.svg)`,

    },
    Linkbuttons: {
        width: 391,
        margin: 'auto',
    },
    LinkButton: {
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 1.25,
        color: theme.colors.black,
        '&:nth-of-type(1)': {
            width: 144,
            marginRight: theme.spacing(5),
            color: theme.colors.primaryBlue,
            '&:hover': {
                color: theme.colors.primaryBlue,
            },
        },
        '&:nth-of-type(2)': {
            width: 116,
            color: theme.colors.black,
            marginRight: theme.spacing(5),
            '&:hover': {
                color: theme.colors.black,
            },
        },
        '&:nth-of-type(3)': {
            width: 91,
            color: theme.colors.black,
            '&:hover': {
                color: theme.colors.black,
            },
        },
    },
    // root: {
    //   backgroundColor: toolBarColor,
    //   flexGrow: 1,
    //   alignItems: 'center',
    // },
    // bloxColor: {
    //   backgroundColor: toolBarColor,
    // },
    // toolbar: {
    //   height: '60px',
    // },
    // button: {
    //   textDecoration: 'none',
    //   color: 'white',
    //   cursor: 'pointer',
    //   fontFamily: 'Encode Sans',
    //   fontWeight: 'bold',
    //   userSelect: 'none',
    //   fontStyle: 'normal',
    //   fontSize: '12px',
    //   lineHeight: '150%',
    //   textTransform: 'uppercase',
    //   [theme.breakpoints.down('md')]: {
    //     display: 'none',
    //   },
    // },
    // mainButton: {
    //   textDecoration: 'none',
    //   color: 'white',
    //   cursor: 'pointer',
    //   userSelect: 'none',
    //   fontFamily: 'Fira Code',
    //   fontStyle: 'normal',
    //   fontWeight: 500,
    //   fontSize: '14px',
    //   display: 'inline-block',
    // },
    // menuIcon: {
    //   cursor: 'pointer',
    //   fontSize: '40px',
    //   marginTop: '5px',
    // },
    // menu: {
    //   verticalAlign: 'center',
    //   [theme.breakpoints.up('lg')]: {
    //     display: 'none',
    //   },
    // },
    // fullScreen: {
    //   color: 'white',
    //   position: 'absolute',
    //   backgroundColor: toolBarColor,
    //   height: '187px',
    //   width: '100%',
    //   textAlign: 'center',
    //   // paddingTop: '32px',
    //   zIndex: 1000,
    // },
    // menuButton: {
    //   fontWeight: 'bold',
    //   width: '100%',
    //   margin: 'auto',
    //   color: 'white',
    //   cursor: 'pointer',
    //   fontFamily: 'Encode Sans',
    //   userSelect: 'none',
    //   fontStyle: 'normal',
    //   fontSize: '12px',
    //   lineHeight: '150%',
    //   textTransform: 'uppercase',
    // },
    // menuButtonWrapper: {
    //   marginTop: '32px',
    // },
}));
