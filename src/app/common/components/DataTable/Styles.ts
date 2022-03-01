import { makeStyles } from '@material-ui/core/styles';

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
    TableWithBorder: {
        fontSize: 18,
        borderRadius: 16,
        backgroundColor: theme.colors.white,
        // '& h3': {
        //     fontSize: 20,
        //     lineHeight: 1.4,
        //     fontWeight: 'bold',
        //     paddingLeft: '15px',
        //     fontFamily: defaultFont,
        //     color: theme.colors.gray40,
        // },
        '& > .MuiTableContainer-root': {
            // borderRadius: 16,
        },
        '& .MuiTableCell-head': {
            height: 36,
            fontSize: 12,
            fontWeight: 500,
            lineHeight: 1.62,
            textAlign: 'left',
            fontFamily: 'Manrope',
            color: theme.colors.gray40,
            textTransform: 'capitalize',
            padding: '9px 0px 8px 32px',
            backgroundColor: theme.colors.white,
        },
        '& .MuiTableCell-body': {
            height: 'fit-content',
            padding: '12px 0 16px 32px',
        },
    },
    TableHeader: {
        height: 28,
        fontSize: 20,
        lineHeight: 1.4,
        textAlign: 'left',
        marginBottom: 20,
        fontWeight: 'bold',
        fontFamily: 'Manrope',
        margin: '32px 32px 0',
        color: theme.colors.gray40,
    },
    TableCell: {
        // borderBottom: 'none',
        // textTransform: 'capitalize',
        // lineHeight: '1.62 !important',
        // backgroundColor: 'transparent',
        // fontWeight: '500 !important' as any,
        // color: `${theme.colors.gray40} !important`,
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
