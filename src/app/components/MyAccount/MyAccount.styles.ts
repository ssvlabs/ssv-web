import { makeStyles } from '@material-ui/core/styles';
import screenSizes from '~lib/utils/screenSizes';

export const useStyles = makeStyles(() => ({
    Wrapper: {
        marginTop: '40px',
    },
    Header: {
        marginBottom: '20px',
    },
    HeaderText: {
        fontSize: '28px',
        fontWeight: 900,
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 1.21,
        letterSpacing: 'normal',
        color: '#20eec8',
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
        width: '84px',
        cursor: 'pointer',
        textAlign: 'center',
        textDecoration: 'none',
        border: 'none',
        height: '32px',
        borderRadius: '6px',
        float: 'right',
        color: '#ffffff',
        backgroundColor: '#5b6c84',
    },
    MyBalanceWrapper: {
        [screenSizes.xl]: {
            marginRight: '16px',
        },
    },
    AddButtonText: {
        height: '15px',
        marginTop: '8px',
        display: 'inline-block',
        fontSize: '12px',
        fontWeight: 600,
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        color: '#fff',
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
    TablesWrapper: {
        width: '728px',
    },
    Table: {
        maxWidth: '728px',
        border: 'solid 1px #5b6c84',
        marginBottom: '20px',
        borderRadius: '8px',
    },
}));
