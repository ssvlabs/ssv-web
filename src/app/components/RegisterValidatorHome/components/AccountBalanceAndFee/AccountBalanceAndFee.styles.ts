import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    bodyText: {
        fontSize: '14px',
        color: '#5B6C84',
        fontStyle: 'normal',
        fontFamily: 'Encode Sans',
        fontWeight: 500,
        marginBottom: '20px',
        lineHeight: 1.43,
    },
    ErrorTextWrapper: {
        // height: '84px',
        padding: '10px 16px 14px',
        borderRadius: '1px',
        background: 'rgb(236, 28, 38, 0.08);',
    },
    ErrorText: {
        // height: '60px',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.43,
        color: '#ec1c26',
    },
}));
