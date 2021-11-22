import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    WarningWrapper: {
        height: '120px',
        padding: '10px 16px',
        borderRadius: '1px',
        background: 'rgb(236, 168, 28, 0.12)',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.43,
        color: '#5b6c84',
        marginBottom: '32px',
    },
    ButtonWrapper: {
        margin: '16px',
    },
    SummarySectionWrapper: {
        borderTop: 'solid 1px #e1e5ec',
        paddingTop: '16px',
    },
    SummaryField: {
        marginBottom: '10px',
        justifyContent: 'space-between',
    },
    BoldField: {
        fontSize: '14px',
        fontWeight: 'bold',
        lineHeight: 1.43,
        color: '#5b6c84',
    },
    GreenColor: {
        fontSize: '18px',
        fontWeight: 900,
        lineHeight: 1.28,
        color: 'rgb(32, 238, 200)',
    },
    TotalWrapper: {
        marginTop: '10px',
    },
    AlignRight: {
        textAlign: 'right',
    },
}));
