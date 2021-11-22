import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    PopupMessageWrapper: {
        position: 'absolute',
        width: '327px',
        height: '86px',
        top: '72px',
        right: '12px',
        padding: '19px 20px',
        borderRadius: '8px',
        backgroundColor: '#575e66',
    },
    PopupIcon: {
        width: '20px',
        height: '20px',
        margin: '1px 12px 9px 0',
        padding: '9px 4px 8px',
        backgroundColor: '#f8b53f',
        backgroundRepeat: 'no-repeat, repeat',
    },
    PopupIconDone: {
        width: '20px',
        height: '20px',
        margin: '1px 12px 9px 0',
        padding: '8px 6px 7px',
        borderRadius: '50px',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat, repeat',
        backgroundImage: 'url(/images/step-done.svg)',
    },
    PopupMessageText: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.43,
        color: '#fff',
    },
    PopupExitLogo: {
      cursor: 'pointer',
    },
    TransactionWrapper: {
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: 1.5,
        color: '#a1acbe',
    },
    EtherScanLink: {
        width: '16px',
        backgroundImage: 'url(/images/icons-view-etherscan.svg)',
        height: '16px',
        objectFit: 'contain',
        marginLeft: '12px',
        cursor: 'pointer',
    },
}));