import { makeStyles } from '@material-ui/core/styles';
import screenSizes from '~lib/utils/screenSizes';

export const useStyles = makeStyles((theme) => ({
    Wrapper: {
        marginTop: '40px',
    },
    Header: {
        marginBottom: '20px',
    },
    HeaderText: {
        fontSize: 28,
        fontWeight: 800,
        color: theme.colors.black,
        lineHeight: 1.24,
        fontStyle: 'normal',
        fontStretch: 'normal',
        letterSpacing: -0.5,
    },
    Liquidated: {
        height: '32px',
        marginLeft: '20px',
        padding: '7px 12px',
        backgroundColor: '#fde4e5',
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: 1.13,
        color: '#ec1c26',
    },
    AddButton: {
        width: 100,
        height: 36,
        borderRadius: 8,
        padding: theme.spacing(2, 8.75),
        backgroundColor: theme.colors.primaryBlueTint90,
        cursor: 'pointer',
        textAlign: 'center',
        textDecoration: 'none',
        border: 'none',
        float: 'right',
    },
    MyBalanceWrapper: {
        [screenSizes.xl]: {
            marginRight: theme.spacing(6),
        },
    },
    AddButtonText: {
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 1.25,
        textAlign: 'center',
        color: theme.colors.primaryBlue,
    },
    AddButtonDropDown: {
        zIndex: 100,
        position: 'relative',
        right: '116px',
        borderRadius: '5px',
        top: '8px',
        height: '88px',
        width: '200px',
        backgroundColor: '#fff',
    },
    AddButtonDropDownItem: {
        cursor: 'pointer',
        '&:hover': {
            borderBottom: 'rgba(220, 224, 232, 0.25)',
            backgroundColor: 'rgba(220, 224, 232, 0.25)',
        },
        '&:first-child': {
            border: 'solid 1px #5b6c84',
            borderBottom: 'none',
            borderRadius: '8px 8px 0px 0px',
        },
        '&:last-child': {
            border: 'solid 1px #5b6c84',
            borderTop: 'none',
            borderRadius: '0px 0px 8px 8px',
        },
        borderRadius: '0px 0px 20px 20px',
        margin: '0.5px 0 0',
        padding: '12.5px 0px 11.5px 16px',
        textAlign: 'left',
        backgroundColor: '#fff',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.43,
        color: '#5b6c84',
        // borderRadius: '20px 20px 0px 0px',
    },
    Disable: {
        cursor: 'not-allowed',
        backgroundColor: 'rgba(220, 224, 232, 0.25)',
        color: 'rgba(161, 172, 190, 0.5)',
    },
    TablesWrapper: {
        width: 728,
    },
    Table: {
        maxWidth: 728,
        float: 'right',
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: theme.colors.white,
    },
}));
