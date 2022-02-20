import { makeStyles } from '@material-ui/core/styles';
import { defaultFont } from './theme';

export const useStyles = makeStyles((theme) => ({
    mainContainer: {
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        minHeight: 600,
        padding: theme.spacing(4),
        alignItems: 'center',
        alignContent: 'center',
        margin: 'auto',
        flexDirection: 'row',
    },
    passwordInput: {
        textSecurity: 'disc',
    },
    errorDiv: {
        paddingLeft: '10px',
        width: '100%',
        color: 'red',
        minHeight: '50px',
        lineHeight: '50px',
        backgroundColor: '#FDE6E5',
    },
    errorText: {},
    paddingTop: {
        marginTop: '100px',
    },
    inputWithHint: {
        backgroundColor: 'red',
        display: 'flex',
    },
    inputError: {
        border: '1px solid red',
    },
    textError: {
        fontSize: '0.8rem',
        color: 'red',
    },
    privateKeyTextInput: {
        marginBottom: '10px',
    },
    doneIcon: {
        color: 'green',
        float: 'left',
    },
    badFormat: {
        color: 'red',
        float: 'left',
    },
    fileNameText: {
        textAlign: 'left',
    },
    clearIcon: {
        float: 'right',
    },
    fileContainer: {
        display: 'flex',
        padding: '10px',
        textAlign: 'center',
        alignItems: 'center',
        width: '100%',
        alignContent: 'center',
        height: '50px',
        border: 'dashed thin gray',
    },
    guideStepsContainerPaper: {
        cursor: 'pointer',
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
        '&:hover': {
            backgroundColor: 'aliceblue',
        },
    },
    bigSquareButton: {
        minHeight: 150,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        alignContent: 'center',
        alignItems: 'center',
    },
    bigSquareButtonGrid: {
        margin: 'auto',
        textAlign: 'center',
    },
    bigSquareButtonIcon: {
        width: 30,
        height: 30,
        maxWidth: 30,
        maxHeight: 30,
        margin: 'auto',
    },
    gridContainer: {
        flexGrow: 1,
        flexDirection: 'column',
    },
    rowGridContainer: {
        flexGrow: 1,
        flexDirection: 'row',
    },
    guideStep: {
        marginBottom: theme.spacing(1),
    },
    guideStepText: {
        fontSize: 14,
    },
    arrowIcon: {
        float: 'right',
        marginLeft: 'auto',
        marginRight: theme.spacing(1),
        alignSelf: 'center',
        marginTop: theme.spacing(1),
    },
    paperContainer: {
        padding: 30,
        '@media (max-width:1080px)': {
            padding: 15,
        },
    },
    tableWithBorder: {
        borderRadius: 6,
        fontSize: 18,
        backgroundColor: theme.colors.squareScreenBackground,
        '& h3': {
            fontSize: 20,
            lineHeight: 1.4,
            fontWeight: 'bold',
            paddingLeft: '15px',
            fontFamily: defaultFont,
            color: theme.colors.gray40,
        },
        '& > .MuiTableContainer-root': {
            borderRadius: 6,
        },
        '& .MuiTableCell-head': {
            fontWeight: 'bold',
            fontSize: 12,
            textTransform: 'uppercase',
            color: '#A1ACBE',
        },
    },
    TableCell: {
        fontSize: 20,
        borderBottom: 'none',
        textTransform: 'capitalize',
        lineHeight: '1.62 !important',
        backgroundColor: 'transparent',
        fontWeight: '500 !important' as any,
        color: `${theme.colors.gray40} !important`,
    },
    Link: {
        display: 'inline-flex',
        alignItems: 'center',
        alignContent: 'center',
        cursor: 'pointer',
        flexDirection: 'row',
        color: `${theme.palette.text.primary}!important`,
        borderColor: `${theme.palette.text.primary}!important`,
    },
    overviewSearch: {
        // '-webkit-box-shadow': 'none!important',
        // boxShadow: 'none!important',
        // outlineColor: 'red!important',
        // border: 'none !important',
        // outline: 'none !important',
        // '&.Mui-focused, &:focus-visible': {
        //   '& > .MuiFormControl-root': {
        //     borderImageWidth: 0,
        //     '-webkit-box-shadow': 'none!important',
        //     boxShadow: 'none!important',
        //     outlineColor: 'red!important',
        //     border: 'none !important',
        //     outline: 'none !important',
        //     '& > .MuiInputBase-root': {
        //       '-webkit-box-shadow': 'none!important',
        //       boxShadow: 'none!important',
        //       outlineColor: 'red!important',
        //       borderImageWidth: 0,
        //       border: 'none !important',
        //       outline: 'none !important',
        //     },
        //   },
        // },
        '& > .MuiFormControl-root': {
            // borderImageWidth: 0,
            // '& > .MuiInputBase-root.Mui-focused': {
            //   // border: '1px solid #5B6C84',
            //   borderImageWidth: 0,
            //   '-webkit-box-shadow': 'none!important',
            //   boxShadow: 'none!important',
            //   outlineColor: 'red!important',
            //   border: 'none !important',
            //   outline: 'none !important',
            // },
            '& > .MuiInputBase-root': {
                // '-webkit-box-shadow': 'none!important',
                // boxShadow: 'none!important',
                // outlineColor: 'red!important',
                // outline: 'none!important',
                border: '1px solid #5B6C84',
                '-webkit-appearance': 'none',
                borderRadius: 6,
                backgroundColor: 'white',
                color: '#5B6C84',
                '& > .MuiInputAdornment-root > .MuiButtonBase-root': {
                    backgroundColor: '#5B6C84',
                    height: 38,
                    width: 38,
                    marginRight: -13,
                    borderBottomRightRadius: 5,
                    borderTopRightRadius: 5,
                },
                '& > .MuiInputAdornment-root > .MuiButtonBase-root > .MuiIconButton-label': {
                    color: 'white',
                },
            },
        },
    },
    appBarSearch: {
        display: 'inline-flex',
        '& > .MuiFormControl-root': {
            '& > .MuiInputBase-root': {
                border: '1px solid #5B6C84',
                color: '#5B6C84',
                width: 340,
                display: 'inline-flex',
                margin: 'auto',
                marginRight: 10,
                '& > .MuiInputAdornment-root > .MuiButtonBase-root > .MuiIconButton-label': {
                    color: 'white',
                },
                '& > .MuiInputAdornment-root > .MuiButtonBase-root': {
                    borderColor: 'white',
                },
                '& > .MuiInputBase-input': {},
            },
        },
    },
}));

const size = {
    mobileS: '320px',
    mobileM: '375px',
    mobileL: '425px',
    tablet: '768px',
    laptopM: '960px',
    laptop: '1024px',
    laptopL: '1440px',
    desktop: '2560px',
};

export const mediaQueryDevices = {
    mobileS: `min-width: ${size.mobileS}`,
    mobileM: `min-width: ${size.mobileM}`,
    mobileL: `min-width: ${size.mobileL}`,
    tablet: `min-width: ${size.tablet}`,
    laptop: `min-width: ${size.laptop}`,
    laptopM: `min-width: ${size.laptopM}`,
    laptopL: `min-width: ${size.laptopL}`,
    desktop: `min-width: ${size.desktop}`,
    desktopL: `min-width: ${size.desktop}`,
};
