import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    BorderScreenWrapper: {
        maxWidth: '560px',
        margin: '20px auto',
    },
    LinkWrapper: {
        marginBottom: '20px',
    },
    ScreenWrapper: {
        border: 'solid 1px #5b6c84',
        height: '416px',
        borderRadius: '8px',
        backgroundColor: '#fff',
    },
    Section: {
        padding: '16px',
        height: 'fit-content',
        borderBottom: 'solid 1px #dce0e8',
    },
    Header: {
        fontSize: '20px',
        fontWeight: 900,
        lineHeight: 1.4,
        color: '#5b6c84',
    },
    Conversion: {
        width: '69px',
        float: 'right',
        height: '28px',
        margin: '0 16px 16px 54px',
        borderRadius: '1px',
        border: 'solid 1px #5b6c84',
        backgroundColor: '#fff',
    },
    Currency: {
        backgroundColor: '#fafafa',
        color: '#5b6c84',
        padding: '6px',
        fontSize: '10px',
        fontWeight: 600,
        cursor: 'pointer',
    },
    SelectedCurrency: {
        backgroundColor: '#5b6c84',
        color: '#fff',
    },
}));
