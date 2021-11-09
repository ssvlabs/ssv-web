import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    mainContainer: {
        height: '100%',
        width: 500,
        maxWidth: '100%',
        minHeight: 600,
        padding: theme.spacing(4),
        alignItems: 'center',
        alignContent: 'center',
        margin: 'auto',
        flexDirection: 'row',
    },
    checkboxText: {
        fontSize: '14px',
        fontWeight: 500,
        color: '#5B6C84',
        fontFamily: 'Encode Sans',
    },
    passwordInput: {
        textSecurity: 'disc',
        border: '1px solid #5B6C84',
        boxSizing: 'border-box',
        borderRadius: '6px',
    },
    errorDiv: {
        paddingLeft: '10px',
        width: '100%',
        color: 'red',
        marginTop: '12px',
        minHeight: '50px',
        lineHeight: '50px',
        backgroundColor: '#FDE6E5',
    },
    errorText: {},
    gridItem: {
        marginBottom: '18px',
    },
    inputWithHint: {
        backgroundColor: 'red',
        display: 'flex',
    },
    inputError: {
        border: '1px solid red !important',
    },
    feeInputWrapper: {
        verticalAlign: 'middle',
        fontSize: '15px',
        width: '100%',
        height: '48px',
        background: '#FFFFFF',
        border: '1px solid #5B6C84',
        boxSizing: 'border-box',
        borderRadius: '6px',
        paddingLeft: '10px',
        marginTop: '8px',
    },
    feeInput: {
        '&::after': {
            content: '"akjsdbajksnbdjkasndjklasndjkansjdknasjkdnasjkdnjkasndjkansjkdn"',
        },
        margin: 'auto auto auto 0px',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.43,
        color: '#a1acbe',
    },
    disable: {
        background: '#DCE0E8 !important',
        border: '1px solid #DCE0E8 !important',
    },
    textError: {
        fontSize: '0.8rem',
        color: 'red',
    },
    privateKeyTextInput: {
        marginBottom: '10px',
    },
    approvedIcon: {
        float: 'left',
        width: '39px',
        height: '39px',
    },
    badFormat: {
        color: 'red',
        float: 'left',
    },
    fileNameText: {
        '@media (min-width: 1024px)': {
            paddingLeft: '10px',
        },
        textAlign: 'left',
    },
    removeIconWrapper: {
        display: 'flex',
    },
    clearIcon: {
        cursor: 'pointer',
    },
    fileContainer: {
        display: 'flex',
        padding: '10px',
        textAlign: 'center',
        alignItems: 'center',
        width: '100%',
        alignContent: 'center',
        height: '79px',
        boxSizing: 'border-box',
        borderRadius: '6px',
        marginTop: '12px',
        backgroundImage: 'url("data:image/svg+xml,%3csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3crect width=\'100%25\' height=\'100%25\' fill=\'none\' rx=\'4\' ry=\'4\' stroke=\'rgba(91, 108, 132, 1)\' stroke-width=\'3\' stroke-dasharray=\'10%2c 10\' stroke-dashoffset=\'30\' stroke-linecap=\'square\'/%3e%3c/svg%3e")',
    },
    guideStepsContainerPaper: {
        cursor: 'pointer',
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
        '&:hover': {
            backgroundColor: 'aliceblue',
        },
        boxShadow: '0px 5px 13px rgba(91, 108, 132, 0.16)',
        borderRadius: '6px',
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
    bodyText: {
        marginBottom: '20px',
        '&:last-of-type': {
            marginBottom: '0px',
        },
    },
    columnGridContainer: {
        flexGrow: 1,
        flexDirection: 'column',
    },
    guideStep: {
        marginBottom: theme.spacing(1),
    },
    guideStepText: {
        fontFamily: 'Encode Sans',
        fontStyle: 'normal',
        fontWeight: 900,
        fontSize: 18,
    },
    guideStepSubText: {
        fontFamily: 'Encode Sans',
    },
    arrowIcon: {
        float: 'right',
        color: '#20EEC8',
        marginLeft: 'auto',
        marginRight: theme.spacing(1),
        alignSelf: 'center',
        marginTop: theme.spacing(1),
    },
}));
