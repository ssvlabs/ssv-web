import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    header: {
        fontFamily: 'Encode Sans',
        fontWeight: 'bold',
        fontSize: '12px',
    },
    subHeader: {
        fontFamily: 'Encode Sans',
        fontSize: '14px',
    },
    section: {
        fontFamily: 'Encode Sans',
        '&:first-of-type': {
            fontSize: '12px',
            marginBottom: '8px',
            fontFamily: 'Encode Sans',
            fontStyle: 'normal',
            fontWeight: 'bold',
            color: '#A1ACBE',
            '&:p': {

            },
        },
        '&:not(:first-of-type)': {
            marginBottom: '4px',
            fontFamily: 'Encode Sans',
            fontStyle: 'normal',
            fontSize: '14px',
            fontWeight: '500',
            color: '#5B6C84',
        },
        marginBottom: '4px',
    },
    dataValue: {
        textAlign: 'right',
    },
    key: {
        '&:first-of-type': {
            fontWeight: 'bold',
            fontFamily: 'Encode Sans',
        },
    },
    value: {
        color: '#5B6C84',
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
