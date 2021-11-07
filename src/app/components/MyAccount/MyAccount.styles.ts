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
    AddButton: {
        width: '84px',
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
        fontSize: '12px',
        fontWeight: 600,
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        textAlign: 'center',
        color: '#fff',
    },
    TablesWrapper: {
        width: '728px',
    },
    Table: {
        width: '728px',
        border: 'solid 1px #5b6c84',
        marginBottom: '20px',
        borderRadius: '8px',
    },
}));
