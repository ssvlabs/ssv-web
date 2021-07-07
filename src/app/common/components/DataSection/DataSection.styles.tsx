import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    header: {
        lineHeight: '1.5',
        fontFamily: 'Encode Sans',
        fontWeight: 700,
        fontSize: '12px',
        color: '#A1ACBE',
        textTransform: 'uppercase',
    },
    subHeader: {
        lineHeight: '1.5',
        fontWeight: 500,
        fontFamily: 'Encode Sans',
        fontSize: '14px',
        color: '#5B6C84',
    },
    section: {
        fontFamily: 'Encode Sans',
        '&:first-of-type': {
            marginBottom: '10px',
            fontStyle: 'normal',
        },
        '&:not(:first-of-type)': {
            marginBottom: '4px',
            fontStyle: 'normal',
        },
        marginBottom: '4px',
    },
    dataValue: {
        fontWeight: 500,
        fontFamily: 'Encode Sans',
        fontSize: '14px',
        color: '#5B6C84',
        textAlign: 'right',
    },
    key: {
        '&:first-of-type': {
            fontWeight: 'bold',
            fontFamily: 'Encode Sans',
        },
    },
    total: {
        marginTop: '8px',
        fontFamily: 'Encode Sans',
        fontStyle: 'normal',
        fontWeight: 900,
        color: '#20EEC8',
        fontSize: '18px',
    },
}));
