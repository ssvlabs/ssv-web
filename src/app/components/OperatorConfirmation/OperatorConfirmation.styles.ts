import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    SubHeader: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.14,
        color: theme.colors.gray40,
        marginBottom: theme.spacing(2),
    },
    Section: {
        padding: theme.spacing(4, 8, 8, 8),
        height: 'fit-content',
        borderBottom: `solid 1px ${theme.colors.gray20}`,
        '&:nth-child(2)': {
            padding: theme.spacing(5, 8, 4, 8),
        },
        '&:nth-child(3)': {
            borderBottom: 'none',
        },
    },
    RowWrapper: {
        marginBottom: theme.spacing(2),
    },
    MarginButton: {
        marginBottom: theme.spacing(10),
    },
    AlignRight: {
        textAlign: 'right',
    },
    YearText: {
        width: '73px',
        height: '18px',
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: 1.5,
        color: '#a1acbe',
    },
    UnderLine: {
        marginTop: '15.5px',
        height: '1px',
        border: 'solid 1px #e1e5ec',
    },
}));
